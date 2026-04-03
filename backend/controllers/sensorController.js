const db = require('../database/db');

/**
 * GET /api/sensors
 * Lấy danh sách loại cảm biến (cho Dropdown filter)
 */
const getSensors = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, topic, created_at FROM sensors ORDER BY created_at');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching sensors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/sensors/latest
 * Lấy 3 chỉ số cảm biến mới nhất (temp, hum, light)
 */
const getLatestSensorData = async (req, res) => {
  try {
    // Subquery: lấy bản ghi mới nhất cho mỗi sensor_id
    const query = `
      SELECT sd.sensor_id, s.name AS sensor_name, sd.value, sd.created_at
      FROM sensor_data sd
      INNER JOIN sensors s ON sd.sensor_id = s.id
      INNER JOIN (
        SELECT sensor_id, MAX(id) AS max_id
        FROM sensor_data
        GROUP BY sensor_id
      ) latest ON sd.id = latest.max_id
      ORDER BY s.created_at
    `;
    const [rows] = await db.query(query);

    // Format response dạng object
    const result = {};
    rows.forEach(row => {
      result[row.sensor_id] = {
        sensor_id: row.sensor_id,
        sensor_name: row.sensor_name,
        value: row.value,
        created_at: row.created_at,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching latest sensor data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/sensors/chart?limit=20
 * Lấy N điểm dữ liệu gần nhất cho biểu đồ (grouped by timestamp)
 */
const getChartData = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    // Lấy N bản ghi gần nhất, nhóm theo created_at
    // Mỗi lần hardware gửi, 3 sensor cùng 1 timestamp
    const query = `
      SELECT sd.sensor_id, sd.value, sd.created_at
      FROM sensor_data sd
      WHERE sd.created_at IN (
        SELECT created_at FROM (
          SELECT DISTINCT created_at
          FROM sensor_data
          ORDER BY created_at DESC
          LIMIT ?
        ) AS sub
      )
      ORDER BY sd.created_at ASC, sd.sensor_id ASC
    `;
    const [rows] = await db.query(query, [limit]);

    // Group by created_at -> { time, temperature, humidity, light }
    const grouped = {};
    rows.forEach(row => {
      const timeKey = new Date(row.created_at).toISOString();
      if (!grouped[timeKey]) {
        grouped[timeKey] = {
          time: new Date(row.created_at).toLocaleTimeString('vi-VN', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
          }),
          created_at: row.created_at,
        };
      }
      // Map sensor_id to chart field names
      if (row.sensor_id === 'dht_temp') grouped[timeKey].temperature = row.value;
      else if (row.sensor_id === 'dht_hum') grouped[timeKey].humidity = row.value;
      else if (row.sensor_id === 'light') grouped[timeKey].light = row.value;
    });

    const chartData = Object.values(grouped).sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    res.json(chartData);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/sensor-data?sensor_id=&from=&to=&search=&page=&pageSize=&sortBy=&sortOrder=
 * Lịch sử cảm biến, phân trang backend
 */
const getSensorData = async (req, res) => {
  try {
    const {
      sensor_id,
      search,
      page = 1,
      pageSize = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = parseInt(page);
    const pageSizeNum = parseInt(pageSize);
    const offset = (pageNum - 1) * pageSizeNum;

    // Validate sortBy
    const allowedSortBy = ['created_at', 'value'];
    const safeSortBy = allowedSortBy.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC';

    // Build WHERE conditions
    const conditions = [];
    const params = [];

    if (sensor_id && sensor_id !== 'all') {
      conditions.push('sd.sensor_id = ?');
      params.push(sensor_id);
    }

    // search: tìm theo ID, giá trị, hoặc chuỗi giờ (HH:mm:ss)
    if (search) {
      conditions.push(`(
        CAST(sd.id AS CHAR) LIKE ?
        OR CAST(sd.value AS CHAR) LIKE ?
        OR DATE_FORMAT(sd.created_at, '%H:%i:%s') LIKE ?
        OR DATE_FORMAT(sd.created_at, '%Y-%m-%d') LIKE ?
        OR DATE_FORMAT(sd.created_at, '%Y-%m-%d %H:%i:%s') LIKE ?
      )`);
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    // Count total
    const countQuery = `SELECT COUNT(*) AS total FROM sensor_data sd ${whereClause}`;
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    // Fetch data
    const dataQuery = `
      SELECT sd.id, sd.sensor_id, s.name AS sensor_name, sd.value, sd.created_at
      FROM sensor_data sd
      INNER JOIN sensors s ON sd.sensor_id = s.id
      ${whereClause}
      ORDER BY sd.${safeSortBy} ${safeSortOrder}
      LIMIT ? OFFSET ?
    `;
    const [rows] = await db.query(dataQuery, [...params, pageSizeNum, offset]);

    res.json({
      data: rows,
      total,
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages: Math.ceil(total / pageSizeNum),
    });
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getSensors,
  getLatestSensorData,
  getChartData,
  getSensorData,
};

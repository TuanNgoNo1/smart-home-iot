const db = require('../database/db');

/**
 * GET /api/action-history?device_id=&status=&from=&to=&search=&page=&pageSize=&sortOrder=
 * Lịch sử điều khiển, phân trang backend
 */
const getActionHistory = async (req, res) => {
  try {
    const {
      device_id,
      status,
      from,
      to,
      search,
      page = 1,
      pageSize = 10,
      sortOrder = 'desc',
    } = req.query;

    const pageNum = parseInt(page);
    const pageSizeNum = parseInt(pageSize);
    const offset = (pageNum - 1) * pageSizeNum;
    const safeSortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC';

    // Build WHERE conditions
    const conditions = [];
    const params = [];

    if (device_id && device_id !== 'all') {
      conditions.push('ah.device_id = ?');
      params.push(device_id);
    }

    if (status && status !== 'all') {
      conditions.push('ah.status = ?');
      params.push(status.toUpperCase());
    }

    if (from) {
      conditions.push('ah.created_at >= ?');
      params.push(from);
    }

    if (to) {
      conditions.push('ah.created_at <= ?');
      params.push(to);
    }

    // search: tìm theo ID, action, device name, chuỗi giờ
    if (search) {
      conditions.push(`(
        CAST(ah.id AS CHAR) LIKE ?
        OR ah.action LIKE ?
        OR ah.status LIKE ?
        OR d.name LIKE ?
        OR DATE_FORMAT(ah.created_at, '%H:%i:%s') LIKE ?
        OR DATE_FORMAT(ah.created_at, '%Y-%m-%d') LIKE ?
      )`);
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    // Count total
    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM action_history ah 
      INNER JOIN devices d ON ah.device_id = d.id
      ${whereClause}
    `;
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    // Fetch data
    const dataQuery = `
      SELECT ah.id, ah.request_id, ah.device_id, d.name AS device_name, 
             ah.action, ah.status, ah.created_at
      FROM action_history ah
      INNER JOIN devices d ON ah.device_id = d.id
      ${whereClause}
      ORDER BY ah.created_at ${safeSortOrder}
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
    console.error('Error fetching action history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getActionHistory,
};

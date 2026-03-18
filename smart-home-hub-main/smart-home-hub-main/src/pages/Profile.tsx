import { Navigation } from "@/components/shared/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  FileText, 
  BookOpen, 
  Github, 
  GraduationCap, 
  IdCard,
  ExternalLink,
  Cpu,
  Database,
  Globe,
  Server,
  Radio
} from "lucide-react";
import avatarImage from "@/assets/avatar.png";

const Profile = () => {
  // Personal Information - Update these with real data
  const profileData = {
    name: "Ngô Đức Anh Tuấn",
    className: "D22PTDPT02",
    studentId: "B22DCPT248",
    avatarUrl: avatarImage,
    description: "Đồ án IoT - Hệ thống giám sát và điều khiển thiết bị thông minh",
  };

  // Important Links - Update these with real URLs
  const links = {
    reportPdf: "https://example.com/report.pdf",
    apiDocs: "https://example.com/swagger",
    gitRepo: "https://github.com/username/iot-project",
  };

  // Tech Stack
  const techStack = {
    hardware: ["ESP8266", "DHT11", "LDR (Quang trở)", "LEDs"],
    protocol: ["MQTT", "Mosquitto Broker", "WebSocket"],
    backend: ["Node.js", "Express.js"],
    frontend: ["React", "TypeScript", "Vite", "Tailwind CSS", "Recharts"],
    database: ["MySQL"],
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen">
      <Navigation isConnected={true} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Profile Header Card - Gradient Style */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-blue-50 via-blue-100/50 to-green-50 p-8">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <Avatar className="w-28 h-28 border-4 border-white shadow-xl">
                  <AvatarImage src={profileData.avatarUrl} alt={profileData.name} className="object-cover object-top" />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600">
                    {getInitials(profileData.name)}
                  </AvatarFallback>
                </Avatar>
                
                {/* Personal Info */}
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-emerald-600">
                    {profileData.name}
                  </h1>
                  
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4" />
                      <span className="font-medium">{profileData.className}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <IdCard className="w-4 h-4" />
                      <span className="font-medium">{profileData.studentId}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm">
                    {profileData.description}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Important Links */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <ExternalLink className="w-5 h-5 text-primary" />
                Liên kết quan trọng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {/* PDF Report */}
                <a 
                  href={links.reportPdf} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="text-center">
                    <span className="font-medium text-foreground block">Báo cáo PDF</span>
                    <span className="text-xs text-muted-foreground">Xem tài liệu</span>
                  </div>
                </a>

                {/* API Documentation */}
                <a 
                  href={links.apiDocs} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="text-center">
                    <span className="font-medium text-foreground block">API Docs</span>
                    <span className="text-xs text-muted-foreground">Swagger UI</span>
                  </div>
                </a>

                {/* Git Repository */}
                <a 
                  href={links.gitRepo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Github className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="text-center">
                    <span className="font-medium text-foreground block">Source Code</span>
                    <span className="text-xs text-muted-foreground">GitHub Repository</span>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Cpu className="w-5 h-5 text-primary" />
                Tech Stack
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Hardware */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Cpu className="w-4 h-4" />
                  Hardware
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStack.hardware.map((tech) => (
                    <Badge key={tech} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-normal">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Protocol */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Radio className="w-4 h-4" />
                  Protocol
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStack.protocol.map((tech) => (
                    <Badge key={tech} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-normal">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Backend */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Server className="w-4 h-4" />
                  Backend
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStack.backend.map((tech) => (
                    <Badge key={tech} variant="outline" className="bg-green-50 text-green-700 border-green-200 font-normal">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Frontend */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  Frontend
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStack.frontend.map((tech) => (
                    <Badge key={tech} variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200 font-normal">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Database */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Database className="w-4 h-4" />
                  Database
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStack.database.map((tech) => (
                    <Badge key={tech} variant="outline" className="bg-red-50 text-red-700 border-red-200 font-normal">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>


        </div>
      </main>
    </div>
  );
};

export default Profile;

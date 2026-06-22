import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskChart from "@/components/TaskChart";

const DashBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    rate: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks?filter=all");
      const allTasks = res.data.tasks || [];
      setTasks(allTasks);

      const total = allTasks.length;
      const completed = allTasks.filter((t) => t.status === "completed" || t.status === "complete").length;
      const active = allTasks.filter((t) => t.status === "active").length;
      const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

      setStats({ total, active, completed, rate });
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-slate-500 font-medium">Đang tải dữ liệu thống kê...</div>
      </div>
    );
  }

  // Get recent tasks
  const recentActive = tasks.filter((t) => t.status === "active").slice(0, 4);
  const recentCompleted = tasks.filter((t) => t.status === "completed" || t.status === "complete").slice(0, 4);

  return (
    <div className="w-full relative py-8 px-6 max-w-5xl mx-auto space-y-8 z-10">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Bảng thống kê hiệu suất
        </h1>
        <p className="text-slate-500 text-sm">
          Phân tích tiến độ và xem các hoạt động quản lý công việc của bạn.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Tasks Card */}
        <Card className="border-0 bg-white/60 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-sm font-medium text-slate-500">Tổng công việc</span>
              <p className="text-3xl font-extrabold text-slate-800">{stats.total}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
              <ClipboardList className="size-6" />
            </div>
          </CardContent>
        </Card>

        {/* Active Tasks Card */}
        <Card className="border-0 bg-white/60 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-sm font-medium text-slate-500">Đang thực hiện</span>
              <p className="text-3xl font-extrabold text-amber-600">{stats.active}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl text-amber-600">
              <Clock className="size-6" />
            </div>
          </CardContent>
        </Card>

        {/* Completed Tasks Card */}
        <Card className="border-0 bg-white/60 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-sm font-medium text-slate-500">Đã hoàn thành</span>
              <p className="text-3xl font-extrabold text-emerald-600">{stats.completed}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600">
              <CheckCircle2 className="size-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress & Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completion Rate Card */}
        <Card className="border-0 bg-white/60 backdrop-blur-md shadow-md lg:col-span-1 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <TrendingUp className="size-5" />
              <span className="font-semibold text-sm">Tỷ lệ hoàn thành</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-4xl font-black text-slate-800">{stats.rate}%</span>
                <span className="text-xs text-slate-400">công việc hoàn tất</span>
              </div>
              
              {/* Custom progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-linear-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${stats.rate}%` }}
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-6 italic">
            {stats.rate === 100 
              ? "🎉 Tuyệt vời! Bạn đã hoàn thành xuất sắc tất cả công việc!" 
              : stats.rate >= 50 
              ? "💪 Tốt lắm! Bạn đã hoàn thành hơn một nửa công việc rồi, cố lên!" 
              : stats.total > 0 
              ? "✍️ Hãy tập trung hoàn thành các mục tiêu tiếp theo nào!"
              : "✨ Chưa có công việc nào được tạo. Hãy quay lại trang chủ để bắt đầu!"}
          </p>
        </Card>

        {/* Task lists split */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active List */}
          <Card className="border-0 bg-white/60 backdrop-blur-md shadow-md p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-amber-600 font-semibold text-sm border-b border-slate-100 pb-2">
              <Clock className="size-4" />
              <span>Cần làm gấp ({stats.active})</span>
            </div>
            <div className="flex-1 space-y-3">
              {recentActive.length > 0 ? (
                recentActive.map((t) => (
                  <div key={t._id} className="flex items-start gap-2.5 p-2.5 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors">
                    <AlertCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-slate-700 line-clamp-2">{t.title}</span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[140px] text-slate-400 text-xs">
                  Không có công việc đang chờ
                </div>
              )}
            </div>
          </Card>

          {/* Completed List */}
          <Card className="border-0 bg-white/60 backdrop-blur-md shadow-md p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-emerald-600 font-semibold text-sm border-b border-slate-100 pb-2">
              <CheckCircle2 className="size-4" />
              <span>Mới hoàn thành ({stats.completed})</span>
            </div>
            <div className="flex-1 space-y-3">
              {recentCompleted.length > 0 ? (
                recentCompleted.map((t) => (
                  <div key={t._id} className="flex items-start gap-2.5 p-2.5 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-slate-500 line-through line-clamp-1">{t.title}</span>
                      {t.completedAt && (
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="size-3" />
                          {new Date(t.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[140px] text-slate-400 text-xs">
                  Chưa hoàn thành công việc nào
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Biểu đồ hoạt động ở dưới cùng, kéo dài toàn bộ chiều ngang */}
      <TaskChart tasks={tasks} />
    </div>
  );
};

export default DashBoard;
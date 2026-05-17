import AddTasks from '@/components/addTasks'
import DatetimeFilter from '@/components/DatetimeFilter'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import StatsAndFilters from '@/components/StatsAndFilters'
import TaskList from '@/components/TaskList'
import TaskListPagination from '@/components/TaskListPagination'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { visibleTaskLimit } from '@/lib/data'
import { useAuthStore } from '@/stores/useAuthStore'


const HomePage = () => {


  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [filter, setFilter] = useState('all');
  const [dateQuery, setDateQuery] = useState('today');
  const [page, setPage] = useState(1);


  useEffect(() => {
    fetchTasks();
  }, [dateQuery]);

  useEffect(() => {
    setPage(1);
  }, [filter, dateQuery]);

  //logic truy xuất dữ liệu
  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`);
      setTaskBuffer(res.data.tasks);
      setActiveTaskCount(res.data.activeTaskCount);
      setCompletedTaskCount(res.data.completedTaskCount);

    } catch (error) {
      console.error("Lỗi xảy ra khi truy xuất tasks: ", error);
      toast.error("Lỗi xảy ra khi truy xuất tasks");
    }
  }

  const handleTaskChanged = () => {
    fetchTasks();
  }

  // logic phân trang
  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  }

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }

  const handlePageChange = (newPage) => {
    setPage(newPage);
  }

  //logic lọc dữ liệu
  const filteredTasks = taskBuffer.filter((task) => {
    switch (filter) {
      case 'active':
        return task.status === 'active';
      case 'completed':
        return task.status === 'completed';
      default:
        return true;
    }
  });

  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  );

  if (visibleTasks.length === 0) {
    handlePrev();
  }

  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);

  return (
<div className="min-h-screen w-full bg-[#fefcff] relative">
  {/* Dreamy Sky Pink Glow */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
    }}
  />
     {/* Your Content/Components */}
     <div className='container pt-8 mx-auto relative z-10'>
        <div className='w-full max-w-2xl p-6 mx-auto space-y-6'>

            {/* Đầu trang */}
            <Header/>

            {/* Tạo công việc */}
            <AddTasks handleNewTaskAdded={handleTaskChanged}/>

            {/* Thống kê và bộ lọc */}
            <StatsAndFilters 
              filter={filter}
              setFilter={setFilter}
              activeTaskCount={activeTaskCount}
              completedTaskCount={completedTaskCount}
            />

            {/* Danh sách công việc */}
            <TaskList 
              filteredTasks={visibleTasks} 
              filter={filter}
              handleTaskChanged={handleTaskChanged}
            />

            {/* Phân trang và lọc theo ngày */}
            
            <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
                <TaskListPagination
                  handleNext={handleNext}
                  handlePrev={handlePrev}
                  handlePageChange={handlePageChange}
                  page={page}
                  totalPages={totalPages}
                
                />
                <DatetimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery}/>
            </div>

            {/* Footer */}
            <Footer 
              activeTaskCount={activeTaskCount}
              completedTaskCount={completedTaskCount}
            />
        </div>
    </div>
</div>
  )
}

export default HomePage
import React, { useState } from 'react'
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Calendar, CheckCircle2, Circle, SquarePen, Trash2 } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Input } from './ui/input';

const TaskCard = ({task, index, handleTaskChanged}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updateTaskTitle, setUpdateTaskTitle] = useState(task.title || '');

    const deleteTask = async (taskId) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            toast.success('Công việc đã được xóa thành công');
            handleTaskChanged();
        } catch (error) {
            console.error('Lỗi khi xóa công việc:', error);
            toast.error('Đã có lỗi xảy ra khi xóa công việc');
        }
    }

    const updateTask = async () => {
            try {
                setIsEditing(false);
                await api.put(`/tasks/${task._id}`, { title: updateTaskTitle });
                toast.success(`Công việc đã được cập nhật thành ${updateTaskTitle}`);
                handleTaskChanged();
            } catch (error) {
                console.error('Lỗi khi cập nhật công việc:', error);
                toast.error('Đã có lỗi xảy ra khi cập nhật công việc');
        }
    }

    const toggleTaskCompleteButton = async () => {
        try {
            if(task.status === 'active') {
                await api.put(`/tasks/${task._id}`, { status: 'completed', completedAt: new Date().toISOString() });
                toast.success(`${task.title} đã được hoàn thành`);
            } else {
                await api.put(`/tasks/${task._id}`, { status: 'active', completedAt: null });
                toast.success(`${task.title} đã đổi sang trạng thái chưa hoàn thành`);
            }
            handleTaskChanged();
        } catch (error) {
            console.error('Lỗi khi cập nhật công việc:', error);
            toast.error('Đã có lỗi xảy ra khi cập nhật công việc');
        }
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            updateTask();
        }
    }

  return (
    <Card className={cn(
        'p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-in group',
        task.status === 'completed' && 'opacity-75'
    )}
        style =  {{animationDelay: `${index * 50}ms`}}
    >
        <div className='flex items-center gap-4'>
            {/* nút tròn */}
            <Button
            size="icon"
            variant="ghost"
            className={cn(
                'shrink-0 rounded-full size-8 transition-all duration-200',
                task.status === 'completed'
                ? 'text-success hover:text-success/80'
                : 'text-muted-foreground hover:text-primary '
            )}
            onClick={toggleTaskCompleteButton}
            >
                {task.status === 'completed' ? (
                    <CheckCircle2 className='size-5'/>
                ) : (
                    <Circle className='size-5'/>
                )}

            </Button>

            {/* hiển thị hoặc chỉnh sửa tiêu đề */}
            <div className='flex-1 min-w-0'>
                {isEditing ? (
                    <Input
                    placeholder='Cần phải làm gì ?'
                    className='flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20'
                    type="text"
                    value={updateTaskTitle}
                    onChange={(e) => setUpdateTaskTitle(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onBlur={() => {
                        setIsEditing(false);
                        setUpdateTaskTitle(task.title || '');
                    }}
                    
                    />
                ) : (
                    <p className={cn(
                        'text-base transition-all duration-200',
                        task.status === 'completed' ?
                        'line-through text-muted-foreground'
                        : 'text-foreground'
                    )}>
                        {task.title}
                    </p>
                )}
                {/* ngày tạo & ngày hoàn thành */}
                <div className='flex items-center gap-2 mt-1'>
                    <Calendar className='size-3 text-muted-foreground'/>
                    <span className='text-xs text-muted-foreground'>
                        {new Date(task.createdAt).toLocaleString()}
                    </span>
                    {task.completedAt && (
                        <>
                            <span className='text-xs text-muted-foreground'> - </span>
                            <Calendar className='size-3 text-muted-foreground'/>
                            <span className='text-xs text-muted-foreground'>
                                {new Date(task.completedAt).toLocaleString()}
                            </span>
                        </>
                    )}
                </div>
            </div>
            {/* nút chỉnh sửa & xóa */}
            <div className='hidden gap-2 group-hover:inline-flex animate-slide-up'>
                {/* nút edit */}
                <Button
                size="icon"
                variant="ghost"
                className='shrink-0 transition-colors size-8 text-muted-foreground hover:text-info'
                onClick={() => {
                    setIsEditing(true);
                    setUpdateTaskTitle(task.title || '');
                }}
                >
                    <SquarePen className='size-4'/>
                </Button>
                {/* nút delete */}
                <Button
                size="icon"
                variant="ghost"
                className='shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive'
                onClick={() => deleteTask(task._id)}
                >
                    <Trash2 className='size-4'/>
                </Button>
            </div>
        </div>
        
    </Card>
  )
}

export default TaskCard
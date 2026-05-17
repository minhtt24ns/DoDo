import React from 'react'
import { Card } from './ui/card'
import { Circle } from 'lucide-react';

const TaskEmptyState = ({filter}) => {
  return (
    <Card 
    className='p-8 text-center border-0 bg-gradient-card shadow-custom-md'>
        <div className='space-y-3'>
            <Circle className='size-12 mx-auto text-muted-foreground'/>
            <div>
                <h3 className='font-medium text-foreground'>
                    {
                        filter === 'active' ?
                        'Không có công việc đang thực hiện'
                        : filter === 'completed' ?
                        'Không có công việc đã hoàn thành'
                        : 'Không có công việc'
                    }
                </h3>
                <p className='text-sm text-muted-foreground'>
                    {filter === 'all' ? 'Hãy thêm công việc mới để bắt đầu' 
                    : `Chuyển sang "Tất cả" để thấy những công việc ${filter === 'completed' ? 'đã hoàn thành' : 'đang thực hiện'}`}
                </p>
            </div>
        </div>
    </Card>
  );
}

export default TaskEmptyState
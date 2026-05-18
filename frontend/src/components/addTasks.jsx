import React, { useState } from 'react'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/axios'

const AddTasks = ({handleNewTaskAdded}) => {

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const addTask = async () => {
    if (newTaskTitle.trim() ) {
      try {
        await api.post('/tasks', { title: newTaskTitle });
        toast.success(`Công việc ${newTaskTitle} đã được thêm thành công`);
        handleNewTaskAdded();
      } catch (error) {
        console.error('Lỗi khi thêm công việc:', error);
        toast.error('Đã có lỗi xảy ra khi thêm công việc');
      }

      setNewTaskTitle('');
    }
    else {
      toast.error('Vui lòng nhập tên công việc');
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addTask();
    }
  }



  return (
    <Card className='p-6 border-0 bg-gradient-card shadow-custom-lg'>
        <div className='flex flex-col gap-3 sm:flex-row'>
          <Input
          type='text'
          placeholder='Cần phải làm gì ?'
          className='h-12 text-base bg-slate-100 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20 '
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          />

          <Button
          size='xl'
          className='px-6 bg-linear-to-br from-primary to-primary-light hover:from-primary/90 hover:to-primary-light/90 hover:scale-[1.02] transition-all duration-200 ease-in-out'
          onClick={addTask}
          disabled={!newTaskTitle.trim()}
          >
            <Plus className='size-5'/>
            Thêm
          </Button>
        </div>
    </Card>
  )
}

export default AddTasks
import React from 'react'

const Footer = ({completedTaskCount = 0, activeTaskCount = 0}) => {
  return <>
    {completedTaskCount + activeTaskCount > 0 && (
      <div className='text-center'>
        <p className='text-sm text-muted-foreground'>
          {
            completedTaskCount > 0 && (
              <>
                ️🎉 Tuyệt vời ! Bạn đã hoàn thành {completedTaskCount} công việc
                {
                  activeTaskCount > 0 && `, còn ${activeTaskCount} công việc nữa thôi. Cố lên nào!`
                }
              </>
            )
          }
          {completedTaskCount === 0 && activeTaskCount > 0 && (
            <>
              Hãy bắt đầu làm {activeTaskCount} công việc nào! 💪
            </>
          )}
        </p>
      </div>
    )}
  </>
};

export default Footer
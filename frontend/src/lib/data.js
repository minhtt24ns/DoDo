export const FilterType = {
    all: 'Tất cả',
    active: 'Đang thực hiện',
    completed: 'Hoàn thành'
}

export const options = [
    {
        value: 'today',
        label: 'Hôm nay'
    },
    {
        value: 'week',
        label: 'Tuần này'
    },
    {
        value: 'month',
        label: 'Tháng này'
    },
    {
        value: 'all',
        label: 'Tất cả'
    }
]

export const visibleTaskLimit = 4; //Số lượng task hiển thị trên 1 trang

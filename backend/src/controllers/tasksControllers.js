import Task from "../models/Task.js"; //Viết model API


export const getAllTasks = async (req, res) => {

    const {filter= 'today'} = req.query;
    const userId = req.user._id;
    const now = new Date();
    let startDate;

    switch (filter) {
        case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'week':
            const mondayDate = now.getDate() - (now.getDay() -1) - (now.getDay() === 0 ? 7 : 0);
            startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
            break;
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'all':
        default:
            startDate = null;
            break;
    }

    // Luôn lọc theo userId, kết hợp với filter ngày nếu có
    const query = { userId };
    if (startDate) {
        query.createdAt = { $gte: startDate };
    }

    try {
        const result = await Task.aggregate([
            { $match: query },
            {
                $facet: {
                    tasks: [{$sort: {createdAt: -1}}],
                    activeTaskCount: [{$match: {status: 'active'}}, {$count: 'activeCount'}],
                    completedTaskCount: [{$match: {status: 'completed'}}, {$count: 'completedCount'}],
                }
            }
        ])

        const tasks = result[0].tasks;
        const activeTaskCount = result[0].activeTaskCount[0]?.activeCount || 0;
        const completedTaskCount = result[0].completedTaskCount[0]?.completedCount || 0;

        res.status(200).json({tasks, activeTaskCount, completedTaskCount});
    } catch (error) {
        console.error("Lỗi khi gọi getAllTasks:", error);
        res.status(500).json({ message: error.message });
    }
};

export const createTask = async (req, res) => {
    try {
        const {title} = req.body;
        const task = new Task({
            title,
            userId: req.user._id,
        });

        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error("Lỗi khi gọi createTask:", error);
        res.status(500).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const {title, status, completedAt} = req.body;

        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id }, // Chỉ update task của user hiện tại
            {title, status, completedAt}, // Lấy từ req.body
            {new: true} // Sau khi update xong, trả về giá trị sau khi update
        );
        //Kiểm tra xem task có tồn tại không
        if (!updatedTask) {
            return res.status(404).json({ message: "Nhiệm vụ không tồn tại hoặc bạn không có quyền" });
        }
        res.status(200).json(updatedTask);

    } catch (error) {
        console.error("Lỗi khi gọi updateTask:", error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id, // Chỉ xóa task của user hiện tại
        });
        
        // Kiểm tra xem task có tồn tại không
        if (!deletedTask) {
            return res.status(404).json({ message: "Nhiệm vụ không tồn tại hoặc bạn không có quyền" });
        }
        res.status(200).json(deletedTask);
    } catch (error) {
        console.error("Lỗi khi gọi deleteTask:", error);
        res.status(500).json({ message: error.message });
    }
};
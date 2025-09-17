/**
 * Node modules
 */
import { Priority } from '@prisma/client';

export const getSampleData = () => ({
  project: {
    name: 'Chào mừng bạn đến với Tiny Todoist!',
    color: '#4ade80',
  },
  projectTasks: [
    {
      title: 'Tạo một project mới của riêng bạn',
      description: 'Nhấn vào nút "+" ở sidebar để bắt đầu.',
      priority: Priority.P2,
    },
    {
      title: 'Mời bạn bè vào project (Tính năng sắp ra mắt)',
      priority: Priority.P3,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  ],
  inboxTasks: [
    {
      title: 'Kiểm tra email công việc',
      priority: Priority.P2,
    },
    {
      title: 'Lên lịch hẹn với nha sĩ',
      description: 'Kiểm tra định kỳ 6 tháng.',
      priority: Priority.P4,
    },
  ],
  todayTaskWithSubtasks: {
    parent: {
      title: 'Lên kế hoạch cho cuối tuần',
      priority: Priority.P2,
      dueDate: new Date(),
    },
    subtasks: [
      {
        title: 'Mua sắm thực phẩm',
        priority: Priority.P2,
      },
      {
        title: 'Dọn dẹp nhà cửa',
        priority: Priority.P3,
      },
      {
        title: 'Gọi điện cho gia đình',
        priority: Priority.P1,
      },
    ],
  },
});

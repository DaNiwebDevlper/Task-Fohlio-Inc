import { Button, Space } from 'antd'

export const ActionCell = ({ data, onEdit, onDelete }: any) => (
    <Space>
        <Button onClick={() => onEdit(data)}>Edit</Button>
        <Button danger onClick={() => onDelete(data)}>Delete</Button>
    </Space>
)
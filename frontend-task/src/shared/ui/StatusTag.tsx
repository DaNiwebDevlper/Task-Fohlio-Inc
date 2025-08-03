import { Tag } from 'antd'

export const StatusTag = ({ value }: { value: string }) => {
    const map: Record<string, string> = {
        active: 'green',
        banned: 'red',
        pending: 'gold'
    }
    return <Tag color={map[value]}>{value.toUpperCase()}</Tag>
}
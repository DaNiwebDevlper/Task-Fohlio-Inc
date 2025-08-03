import { useQuery, useMutation } from '@apollo/client';
import { GET_USERS, UPDATE_USER } from '../../entities/users/graphql';
import { useUserStore } from '../../entities/users/useStore';
import { Table, Select, Input, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { User } from '../../entities/users/type';
import dayjs from 'dayjs';
import { ActionCell } from './ActionCell';
import { useEffect, useMemo, useState } from 'react';

const { Option } = Select;
const { Search } = Input;

type PropsType = {
    onEdit?: (user: User) => void;
    setUserData?: (user: User) => void;
    onDelete: (user: User) => void;
};

export const UserTable = ({ onEdit, setUserData, onDelete }: PropsType) => {
    const { loading } = useQuery(GET_USERS, {
        onCompleted(data) {
            useUserStore.getState().setUsers(data.users);
        },
    });

    const [updateUser] = useMutation(UPDATE_USER);

    const users = useUserStore((state) => state.users);
    const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
    const [searchText, setSearchText] = useState('');
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    // refetch the user when user role change or search user
    useEffect(() => {
        let filtered = users;
        if (searchText) {
            filtered = filtered.filter(
                (user) =>
                    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        if (selectedRole) {
            filtered = filtered.filter((user) => user.role === selectedRole);
        }
        setFilteredUsers(filtered);
    }, [users, searchText, selectedRole]);



    const handleEditUser = (user: User) => {
        if (onEdit) {
            setUserData?.(user);
            onEdit(user);
        }
    };

    const handleStatusChange = async (value: string, user: User) => {
        await updateUser({ variables: { id: user.id, input: { status: value } } });
        useUserStore.getState().setUsers(
            users.map((u) =>
                u.id === user.id ? { ...u, status: value as User['status'] } : u
            )
        );
    };

    const uniqueRoles = useMemo(() => {
        return [...new Set(users.map((u) => u.role))];
    }, [users]);

    const columns: ColumnsType<User> = [
        { title: 'ID', dataIndex: 'id', responsive: ['md'] },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        { title: 'Email', dataIndex: 'email', responsive: ['md'] },
        {
            title: 'Role',
            dataIndex: 'role',
            filters: uniqueRoles.map((role) => ({
                text: role.charAt(0).toUpperCase() + role.slice(1),
                value: role,
            })),
            onFilter: (value, record) => record.role === value,
            render: (role) => <span>{role}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status: 'active' | 'banned' | 'pending', user: User) => {
                const colorMap = {
                    active: 'green',
                    banned: 'red',
                    pending: 'orange',
                };

                return (
                    <Select
                        value={status}
                        onChange={(val) => handleStatusChange(val, user)}
                        bordered={false}
                        style={{ color: colorMap[status], fontWeight: 500 }}
                    >
                        <Option value="active">Active</Option>
                        <Option value="banned">Banned</Option>
                        <Option value="pending">Pending</Option>
                    </Select>
                );
            },
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            render: (date) => (
                <span title={date}>
                    {dayjs(date).format('DD/MM/YYYY, HH:mm')}
                </span>
            ),
            sorter: (a, b) =>
                dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
            responsive: ['md'],
        },
        {
            title: 'Actions',
            render: (_, user) => (
                <ActionCell
                    onDelete={onDelete}
                    onEdit={handleEditUser}
                    data={user}
                />
            ),
        },
    ];

    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            <Space direction="vertical" size="middle" style={{ marginBottom: 16 }}>
                <Search
                    placeholder="Search by name or email"
                    allowClear
                    enterButton="Search"
                    onSearch={(value) => setSearchText(value)}
                    style={{ width: 300 }}
                />

                <Select
                    placeholder="Filter by role"
                    allowClear
                    style={{ width: 200 }}
                    onChange={(value) => setSelectedRole(value)}
                >
                    {uniqueRoles.map((role) => (
                        <Option key={role} value={role}>
                            {role}
                        </Option>
                    ))}
                </Select>
            </Space>

            <Table
                columns={columns}
                dataSource={filteredUsers}
                loading={loading}
                rowKey="id"
                pagination={filteredUsers.length > 10 ? { pageSize: 10 } : false}
                scroll={{ x: true }}
                bordered
            />
        </div>
    );
};

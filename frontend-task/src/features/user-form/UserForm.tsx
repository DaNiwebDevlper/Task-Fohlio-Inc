import { Modal, Form, Input, Select, Button, notification } from 'antd'
import { useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_USER, GET_USERS, UPDATE_USER } from '../../entities/users/graphql'
import { useUserStore } from '../../entities/users/useStore'
import { toast } from 'react-toastify'

const { Option } = Select

interface Props {
    open: boolean
    onClose: () => void
    user?: any
}

export const UserFormModal = ({ open, onClose, user }: Props) => {
    const [form] = Form.useForm()
    const isEdit = Boolean(user)

    const addUser = useUserStore((state: any) => state.addUser)
    const updateUser = useUserStore((state: any) => state.updateUser)

    const [createUser, { loading: creating }] = useMutation(ADD_USER)
    const [editUser, { loading: updating }] = useMutation(UPDATE_USER)
    const { refetch } = useQuery(GET_USERS)
    useEffect(() => {

        if (user) {
            form.setFieldsValue(user)
        } else {
            form.resetFields()
        }
    }, [user, form, open])



    const handleSubmit = async (values: any) => {
        try {
            if (isEdit) {
                const { data } = await editUser({
                    variables: { id: user.id, input: values },
                })
                updateUser(data.updateUser)
                toast.success('User updated successfully')
            } else {
                const { data } = await createUser({
                    variables: { input: values },
                })
                addUser(data.createUser)
                toast.success('User created successfully')
                refetch()
            }
            onClose()
        } catch (err) {
            notification.error({ message: 'Error submitting form' })
        }
    }



    return (
        <Modal
            title={isEdit ? 'Edit User' : 'Add User'}
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnHidden
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleSubmit}
                preserve={false}
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please enter name' }]}
                >
                    <Input placeholder="Enter full name" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Please enter email' },
                        { type: 'email', message: 'Invalid email' },
                    ]}
                >
                    <Input placeholder="Enter email address" />
                </Form.Item>

                <Form.Item
                    name="role"
                    label="Role"
                    rules={[{ required: true, message: 'Please select role' }]}
                >
                    <Select placeholder="Select role">
                        <Option value="admin">Admin</Option>
                        <Option value="user">User</Option>
                        <Option value="moderator">Moderator</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: 'Please select status' }]}
                >
                    <Select placeholder="Select status">
                        <Option value="active">Active</Option>
                        <Option value="banned">Banned</Option>
                        <Option value="pending">Pending</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={creating || updating}
                        block
                    >
                        {isEdit ? 'Update' : 'Create'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

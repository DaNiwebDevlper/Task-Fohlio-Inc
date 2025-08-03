import { Modal } from 'antd'


interface Props {
    open: boolean
    onClose: () => void
    handleDelete: () => void
    loading?: boolean
}

export const DeleteUserModal = ({ open, onClose, handleDelete, loading }: Props) => {

    return (
        <Modal
            title="Confirm Delete"
            open={open}
            onOk={handleDelete}
            confirmLoading={loading}
            onCancel={onClose}
            okText="Delete"
            okButtonProps={{ danger: true }}
        >
            Are you sure you want to delete this user?
        </Modal>
    )
}

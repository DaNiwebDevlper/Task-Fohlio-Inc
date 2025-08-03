import { useMutation, useQuery } from '@apollo/client'
import { DELETE_USER, GET_USERS } from "../../entities/users/graphql"
import { useUserStore } from '../../entities/users/useStore'

import { Button } from 'antd'
import { useState, useEffect } from 'react'

import { UserFormModal } from '../../features/user-form/UserForm'
import type { User } from '../../entities/users/type'

import { ModuleRegistry } from 'ag-grid-community'
import { AllCommunityModule } from 'ag-grid-community'
ModuleRegistry.registerModules([AllCommunityModule])

// Add AG Grid CSS
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import "../userListStyle.css"
import { UserTable } from '../../shared/ui/UserTable'
import { DeleteUserModal } from '../../features/user-delete/DeleteUserModal'
import { toast } from 'react-toastify'


export const UserList = () => {
    const { setUsers } = useUserStore()
    const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
    const { data } = useQuery(GET_USERS)

    const [modalOpen, setModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)

    const [deleteUser, { loading: deleteUserLoading }] = useMutation(DELETE_USER, {
        onCompleted() {
            useUserStore.getState().deleteUserFromStore(editingUser?.id || '');
        },
        onError(error) {
            console.error("Error deleting user:", error);
        }
    });

    useEffect(() => {
        if (data) setUsers(data.users)
    }, [data])



    const handleEditUser = async () => {
        setModalOpen(prev => !prev)
    }

    const handleDeleteUser = (user: User) => {
        setEditingUser(user);
        setDeleteUserModalOpen(prev => !prev);
    };

    // delete user from dataabase and store
    const onDelete = async () => {
        if (!editingUser?.id) {
            return;
        }
        try {
            await deleteUser({ variables: { id: editingUser.id } });
            useUserStore.getState().deleteUserFromStore(editingUser.id);
            toast.success("User deleted successfully");
        } catch (error) {
            console.error("Error deleting user:", error);

        } finally {
            setDeleteUserModalOpen(false);
            setEditingUser(null);
        }
    }

    return (
        <main className='user-list-container'>

            <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <h1>User Management</h1>
                    <Button type="primary" onClick={() => setModalOpen(prev => !prev)}>Add User</Button>
                </div>
                <UserTable onEdit={handleEditUser} setUserData={setEditingUser} onDelete={handleDeleteUser} />
            </div>


            {
                modalOpen && <UserFormModal
                    open={modalOpen}
                    onClose={() => {
                        setModalOpen(false)
                        setEditingUser(null)
                    }}
                    user={editingUser}
                />
            }


            {deleteUserModalOpen &&
                <DeleteUserModal
                    open={deleteUserModalOpen}
                    onClose={() => { setDeleteUserModalOpen(prev => !prev); setEditingUser(null); }}
                    handleDelete={onDelete}
                    loading={deleteUserLoading}
                />
            }


        </main>
    )
}

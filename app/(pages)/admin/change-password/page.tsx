import AdminLayout from '@/components/admin/AdminLayout'
import ChangePasswordPage from '@/components/admin/ChangePassword'


const page = () => {
  return (
    <div>
      <AdminLayout>
        <ChangePasswordPage/>
      </AdminLayout>
    </div>
  )
}

export default page
import { Route, Routes } from 'react-router-dom';
import { NotFound } from './components/NotFound';
import { Layout } from './components/Layout';
import { UserTable } from './pageComponents/UserTable.page';
import { EditUser } from './pageComponents/EditUser.page';
import { AddUser } from './pageComponents/AddUser.page';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<UserTable />} />
        <Route path="/edit/:userId" element={<EditUser />} />
        <Route path="/add" element={<AddUser />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;

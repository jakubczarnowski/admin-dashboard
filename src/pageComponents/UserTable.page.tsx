import { useMemo } from 'react';
import { Column, useTable } from 'react-table';
import { useDeleteUserMutation, useGetUsersQuery } from '../store/users/users.api';
import {
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { User } from '../store/users/user.types';
import { useNavigate } from 'react-router-dom';

export function UserTable() {
  const { data } = useGetUsersQuery();
  const navigate = useNavigate();
  const [deleteUser] = useDeleteUserMutation();

  const columns: Column<User>[] = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Username',
        accessor: 'username',
      },
      {
        Header: 'City',
        accessor: (row) => row?.address?.city,
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Edit',
        accessor: (row) => row.id,
        Cell: ({ value }: { value: string }) => (
          <Button onClick={() => navigate(`/edit/${value}`)} variant="solid" colorScheme="yellow">
            Edit
          </Button>
        ),
      },

      {
        Header: 'Delete',
        accessor: (row) => row.id,
        Cell: ({ value }: { value: number }) => (
          <Button onClick={() => deleteUser(value)} variant="solid" colorScheme="red">
            Delete
          </Button>
        ),
      },
    ],
    [navigate, deleteUser],
  );
  const users = useMemo(() => data || [], [data]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns: columns,
    data: users,
  });

  return (
    <Flex shadow="base" p={2} direction="column" w="full" alignItems="center">
      <Flex direction="row" w="full" justifyContent="space-between" mb={5}>
        <Text fontSize="2xl" fontWeight="bold">
          User List
        </Text>
        <Button onClick={() => navigate('/add')} variant="solid" colorScheme="blue">
          Add User
        </Button>
      </Flex>
      <TableContainer w="full" shadow="lg" borderRadius="xl">
        <Table {...getTableProps()} variant="striped" size="sm">
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <Th {...column.getHeaderProps()} key={column.id}>
                    {column.render('Header')}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map((cell) => {
                    const { key, ...restCellProps } = cell.getCellProps();
                    return (
                      <Td {...restCellProps} key={key}>
                        {cell.render('Cell')}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
}

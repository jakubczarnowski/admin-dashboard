import { useMemo } from 'react';
import { Column, useSortBy, useTable } from 'react-table';
import { useDeleteUserMutation, useGetUsersQuery } from '../store/users/users.api';
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { User } from '../store/users/user.types';
import { useNavigate } from 'react-router-dom';
import { TiArrowSortedUp, TiArrowSortedDown, TiArrowUnsorted } from 'react-icons/ti';
import { ColumnInstance } from 'react-table';

type ColumnWithSortingOptions<T extends object> = Column<T> & {
  isSortable?: boolean;
};
type ColumnInstanceWithSorting<T extends object> = ColumnInstance<T> & {
  isSortable?: boolean;
};

export function UserTable() {
  const { data, isLoading } = useGetUsersQuery();
  const navigate = useNavigate();
  const columns: ColumnWithSortingOptions<User>[] = useMemo(
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

        sortType: 'alphanumeric',
        isSortable: true,
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
        accessor: (row) => ({ id: row.id, name: row.name }),
        Cell: ({ value }: { value: { id: number; name: string } }) => (
          <DeleteUserButton id={value.id} name={value.name} />
        ),
      },
    ],
    [navigate],
  );
  const users = useMemo(() => data || [], [data]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns: columns,
      data: users,
    },
    useSortBy,
  );

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
                {headerGroup.headers.map((column: ColumnInstanceWithSorting<User>) => (
                  <Th
                    {...column.getHeaderProps(
                      column.isSortable ? column.getSortByToggleProps() : {},
                    )}
                    key={column.id}
                  >
                    <Flex alignItems="center" direction="row">
                      <Text>{column.render('Header')}</Text>
                      {column.isSortable &&
                        (column.isSorted ? (
                          column.isSortedDesc ? (
                            <TiArrowSortedDown />
                          ) : (
                            <TiArrowSortedUp />
                          )
                        ) : (
                          <TiArrowUnsorted />
                        ))}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {isLoading && (
              <Tr>
                <Td textAlign="center" colSpan={columns.length} p={2}>
                  <Spinner />
                </Td>
              </Tr>
            )}
            {rows.length === 0 && !isLoading && (
              <Tr>
                <Td colSpan={columns.length} p={2}>
                  <Text fontWeight="semibold" fontSize="xl" textAlign="center">
                    No data
                  </Text>
                </Td>
              </Tr>
            )}
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

const DeleteUserButton = ({ id, name }: { id: number; name: string }) => {
  const toast = useToast();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [deleteUser] = useDeleteUserMutation();
  const handleDelete = () => {
    deleteUser(id)
      .then(() => {
        toast({
          title: 'User deleted.',
          description: `${name} has been deleted.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: 'Error while deleting user.',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
    onClose();
  };
  return (
    <>
      <Button onClick={() => onToggle()} variant="solid" colorScheme="red">
        Delete
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete {name}?</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="solid" colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

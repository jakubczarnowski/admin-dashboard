import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useGetUsersQuery, useUpdateUserMutation } from '../store/users/users.api';
import { Button, Flex, Spinner, Text, useToast } from '@chakra-ui/react';
import { InputControl } from 'chakra-ui-react-hook-form';
import { useForm } from 'react-hook-form';
import { User } from '../store/users/user.types';
import { UpdateUserFormValues, updateUserValidationSchema } from '../common/validationSchemas';
import { yupResolver } from '@hookform/resolvers/yup';

export const EditUser = () => {
  const { userId } = useParams();
  const { data, isLoading, error } = useGetUsersQuery();
  const user = data?.find((user) => user.id.toString() === userId);
  console.log(user);
  if (isLoading) return <Spinner />;
  if (error || !user) return <Navigate to="/" />;

  return <EditUserContent user={user} />;
};

type EditUserContentProps = {
  user: User;
};

export const EditUserContent = ({ user }: EditUserContentProps) => {
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const toast = useToast();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: user.name,
      username: user.username,
      email: user.email,
      city: user?.address?.city,
    },
    resolver: yupResolver(updateUserValidationSchema),
  });
  const onSubmit = async (data: UpdateUserFormValues) => {
    updateUser({ ...data, id: user.id })
      .then(() => {
        toast({
          title: 'Success',
          description: 'User updated successfully',
          status: 'success',
          duration: 5000,
        });
        navigate('/');
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err.message,
          status: 'error',
          duration: 5000,
        });
      });
  };
  return (
    <Flex shadow="base" p={4} direction="column" w="full" gap={4}>
      <Text fontSize="2xl" fontWeight="bold">
        Edit User
      </Text>
      <Flex direction="column" w="full" alignItems="center" gap={2}>
        <InputControl
          control={control}
          name="name"
          label="Name"
          inputProps={{ autoComplete: 'name' }}
        />
        <InputControl control={control} name="username" label="Username" />
        <InputControl control={control} name="email" label="Email" />
        <InputControl control={control} name="city" label="City" />
      </Flex>
      <Flex direction="row" w="full" justifyContent="flex-end" gap={2} ml="auto">
        <Button onClick={() => navigate('/')} variant="outline" colorScheme="red">
          Cancel
        </Button>
        <Button
          isLoading={isLoading}
          onClick={handleSubmit(onSubmit)}
          variant="solid"
          colorScheme="green"
        >
          Save
        </Button>
      </Flex>
    </Flex>
  );
};

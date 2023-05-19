import { useNavigate } from 'react-router-dom';
import { useCreateUserMutation, useGetUsersQuery } from '../store/users/users.api';
import { Button, Flex, Text, useToast } from '@chakra-ui/react';
import { InputControl } from 'chakra-ui-react-hook-form';
import { useForm } from 'react-hook-form';
import { CreateUserFormValues, createUserValidationSchema } from '../common/validationSchemas';
import { yupResolver } from '@hookform/resolvers/yup';

export const AddUser = () => {
  const [createUser, { isLoading }] = useCreateUserMutation();
  const toast = useToast();
  const navigate = useNavigate();
  const { data: users } = useGetUsersQuery();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
    resolver: yupResolver(createUserValidationSchema),
  });
  const onSubmit = async (data: CreateUserFormValues) => {
    // not optimal, but wouldn't happen in real cases anyway
    createUser({ ...data, id: (users?.length ?? 0) + 1 })
      .then(() => {
        toast({
          title: 'Success',
          description: 'User created successfully',
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
        Add User
      </Text>
      <Flex direction="column" w="full" alignItems="center" gap={2}>
        <InputControl
          control={control}
          name="name"
          label="Name"
          inputProps={{ autoComplete: 'name' }}
        />
        <InputControl control={control} name="email" label="Email" />
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

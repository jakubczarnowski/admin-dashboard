import { CreateUserFormValues, UpdateUserFormValues, WithId } from '../../common/validationSchemas';
import { api } from '../utils/api';
import { User, UsersResponse } from './user.types';

const usersApi = api.enhanceEndpoints({ addTagTypes: ['Users'] }).injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, void>({
      query() {
        return {
          url: '/data',
          method: 'GET',
        };
      },
      providesTags: ['Users'],
    }),
    updateUser: builder.mutation<User, WithId<UpdateUserFormValues>>({
      query({ id, ...body }) {
        return {
          url: `/data/${id}`,
          method: 'PATCH',
          body,
        };
      },
      async onQueryStarted({ id, ...updates }, { dispatch, queryFulfilled }) {
        dispatch(
          usersApi.util.updateQueryData('getUsers', undefined, (curr) =>
            curr?.map((user) =>
              user.id === id
                ? {
                    ...user,
                    ...updates,
                    address: { ...user.address, city: updates?.city ?? user?.address?.city },
                  }
                : user,
            ),
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          // patchResult.undo(); if you operate on new field, the api throws 404
        }
      },
    }),
    createUser: builder.mutation<User, WithId<CreateUserFormValues>>({
      query(body) {
        return {
          url: '/data',
          method: 'POST',
          body,
        };
      },
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        dispatch(
          usersApi.util.updateQueryData('getUsers', undefined, (curr) => [...(curr ?? []), data]),
        );
        try {
          await queryFulfilled;
        } catch {
          // patchResult.undo(); if the new id already exists in db, the api throws 500
        }
      },
    }),
    deleteUser: builder.mutation<null, number>({
      query(id) {
        return {
          url: `/data/${id}`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        dispatch(
          usersApi.util.updateQueryData('getUsers', undefined, (draft) =>
            draft?.filter((user) => user.id !== id),
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          // patchResult.undo(); same as above, if you operate on new field, the api throws 404
        }
      },
    }),
  }),
});

export default usersApi;

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useCreateUserMutation,
} = usersApi;

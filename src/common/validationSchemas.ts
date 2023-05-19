import * as Yup from 'yup';

export const createUserValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Please enter correct email').required('Username is required'),
});

export type CreateUserFormValues = Yup.InferType<typeof createUserValidationSchema>;

export const updateUserValidationSchema = createUserValidationSchema.shape({
  username: Yup.string().optional(),
  city: Yup.string().optional(),
});

export type UpdateUserFormValues = Yup.InferType<typeof updateUserValidationSchema>;
export type WithId<T> = T & { id: number };

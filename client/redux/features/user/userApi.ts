import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //update user avatar/image
    updateAvatar: builder.mutation({
      query: (avatar) => ({
        url: "update-avatar",
        method: "PUT",
        body: { avatar },
        credentials: "include" as const,
      }),
    }),

    //update user info
    updateUserInfo: builder.mutation({
      query: ({ name, email}) => ({
        url: "update-user",
        method: "PUT",
        body: { name, email},
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useUpdateAvatarMutation, useUpdateUserInfoMutation } = userApi;

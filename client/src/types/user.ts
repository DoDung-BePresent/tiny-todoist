export type UpdateProfilePayload = {
  name?: string;
  avatar?: File;
  removeAvatar?: boolean;
};

export type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

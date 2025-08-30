export type Project = {
  id: string;
  name: string;
  color: string;
  isFavorite: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateProjectPayload = {
  name: string;
  color: string;
  isFavorite?: boolean;
};

export type UpdateProjectPayload = Partial<CreateProjectPayload>;

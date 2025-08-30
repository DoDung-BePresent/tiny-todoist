export type CreateProjectPayload = {
  name: string;
  color: string;
  isFavorite?: boolean;
};

export type UpdateProjectPayload = Partial<CreateProjectPayload>;

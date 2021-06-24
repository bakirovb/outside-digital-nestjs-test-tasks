export interface FindUserOptions {
  relations: Array<UserRelations>;
}

export enum UserRelations {
  CreatedTags = 'createdTags',
  Tags = 'tags',
}

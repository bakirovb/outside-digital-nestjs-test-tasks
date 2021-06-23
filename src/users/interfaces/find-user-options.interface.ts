export interface FindUserOptions {
  relations: Array<UserRelations>;
}

export enum UserRelations {
  Tags = 'tags',
}

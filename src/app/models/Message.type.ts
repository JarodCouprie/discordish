export declare type Message = {
  _id: string,
  content: string,
  channelId: string,
  user: User,
  createdAt: Date,
}

declare type User = {
  _id: string,
  firstname: string,
  lastname: string,
  avatarUrl: string,
}

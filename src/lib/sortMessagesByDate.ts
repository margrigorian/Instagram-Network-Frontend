import { IDateSortedMessages, IMessage } from "../store/types/chatsStoreTypes";

export function sortMessagesByDate(
  sortedMessages: IDateSortedMessages[],
  messages: IMessage[]
): IDateSortedMessages[] {
  let sortedMessagesArray: IDateSortedMessages[] = [...sortedMessages];

  messages.forEach(message => {
    const timeOfCurrentMessage = new Date(message.time);
    const dateOfCurrentMessage = timeOfCurrentMessage.getDate();
    const monthOfCurrentMessage = timeOfCurrentMessage.getMonth();
    const yearOfCurrentMessage = timeOfCurrentMessage.getFullYear();
    // определяем существует ли временной блок, равный дате текущего сообщения, в sortedMessages
    const blockIndex = sortedMessagesArray.findIndex(block => {
      const messagesBlockTime = new Date(block.time);
      const messagesBlockDate = messagesBlockTime.getDate();
      const messagesBlockMonth = messagesBlockTime.getMonth();
      const messagesBlockYear = messagesBlockTime.getFullYear();

      if (
        dateOfCurrentMessage === messagesBlockDate &&
        monthOfCurrentMessage === messagesBlockMonth &&
        yearOfCurrentMessage === messagesBlockYear
      ) {
        return true;
      } else {
        return false;
      }
    });

    // блок по дате в sortedMessages существует, расширяем его массив сообщений
    if (blockIndex !== -1) {
      // не через push, иначе react не считает массив как новый, а лишь как мутированный
      // ререндеринга не будет
      sortedMessagesArray[blockIndex] = {
        ...sortedMessagesArray[blockIndex],
        messages: [...sortedMessagesArray[blockIndex].messages, message]
      };
    } else {
      // такого блока по дате пока нет, добавляем
      // проверка важна, так как сортировка может проходиь впервые или же
      // при добавлении сообщение у уже отсортированному
      if (sortedMessages.length > 0) {
        sortedMessagesArray = [{ time: message.time, messages: [message] }, ...sortedMessagesArray];
      } else {
        sortedMessagesArray = [...sortedMessagesArray, { time: message.time, messages: [message] }];
      }
    }
  });

  return sortedMessagesArray;
}

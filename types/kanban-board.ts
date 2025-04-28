import { Board } from "./board";
import { Column } from "./column";
import { Task } from "./task";

export interface KanbanState {
    board: Board;
    columns: { [columnId: string]: Column };
    tasks: { [taskId: string]: Task };
  }
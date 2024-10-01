export interface iEventStore {
  loading: boolean;
  setLoading: (value: boolean) => void;
  snacks: { message: string; type: "error" | "success"; id: number }[];
  setSnacks: (message: string, type: "error" | "success") => void;
  removeSnack: (id: number) => void;
}

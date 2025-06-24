import { useQuery } from "@tanstack/react-query";
import supabase from "../supabase";
interface IUseFetch {
  queryKey: string[];
  fromPath: string;
}
export const useFetch = ({queryKey , fromPath}: IUseFetch) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await supabase.from(`${fromPath}`).select("*")
      return data;
    },
  });
}

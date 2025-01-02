export const getProjectStatusColor = (status: string) => {
  switch (status) {
    case "Planning":
      return "bg-yellow-500";
    case "In Progress":
      return "bg-blue-500";
    case "Completed":
      return "bg-green-500";
    case "On Hold":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};
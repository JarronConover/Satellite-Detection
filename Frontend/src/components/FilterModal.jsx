import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const FilterModal = ({ filters, setFilters }) => {
  const classifications = ["cargo", "fishing", "merchant", "passenger", "warship", "unknown"];


  const handleCheckboxChange = (classification) => {
    setFilters((prev) =>
      prev.includes(classification)
        ? prev.filter((item) => item !== classification)
        : [...prev, classification]
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white border-2 border-gray-400 text-gray-700 hover:bg-gray-200 shadow-md">
          Filter Ships
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>Filter Ships</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {classifications.map((classification) => (
            <div key={classification} className="flex items-center space-x-2">
              <Checkbox
                checked={filters.includes(classification)}
                onCheckedChange={() => handleCheckboxChange(classification)}
              />
              <label className="text-gray-700 capitalize">{classification}</label>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
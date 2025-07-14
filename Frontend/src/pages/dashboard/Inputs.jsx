import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Textarea,
  Button,
} from "@material-tailwind/react";
import { useState } from "react";
import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";

export function Inputs() {
  const [files, setFiles] = useState([]);
  const [intelText, setIntelText] = useState("");

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const handleTextChange = (event) => {
    setIntelText(event.target.value);
  };

  const handleSubmit = () => {
    console.log("Uploaded files:", files);
    console.log("Entered Intel:", intelText);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-10">
      {/* File Upload Section */}
      <Card className="shadow-md rounded-xl">
        <CardHeader
          floated={false}
          shadow={false}
          className="bg-gradient-to-r from-black to-grey px-6 py-4 rounded-t-xl"
        >
          <Typography variant="h5" className="text-white">
            Upload Intel Documents
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <label
            htmlFor="fileUpload"
            className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-blue-400 rounded-lg p-6 cursor-pointer hover:bg-blue-50 transition"
          >
            <DocumentArrowUpIcon className="h-10 w-10 text-blue-500" />
            <Typography variant="small" className="text-blue-700 font-medium">
              Click or drag files here to upload
            </Typography>
            <input
              id="fileUpload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {files.length > 0 && (
            <div className="mt-2">
              <Typography variant="small" color="gray" className="font-semibold mb-1">
                Selected Files:
              </Typography>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {files.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Intel Text Section */}
      <Card className="shadow-md rounded-xl">
        <CardHeader
          floated={false}
          shadow={false}
          className="bg-gradient-to-r from-black to-grey px-6 py-4 rounded-t-xl"
        >
          <Typography variant="h5" className="text-white">
            Type your Intel here
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Textarea

            value={intelText}
            onChange={handleTextChange}
            rows={8}
            resize
            className="w-full border rounded-lg p-4 text-gray-800 focus:outline-none "
          />
        </CardBody>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          color="purple"
          onClick={handleSubmit}
          className="px-6 py-2 rounded-lg bg-black text-white font-semibold"
        >
          Submit Intel
        </Button>
      </div>
    </div>
  );
}

export default Inputs;

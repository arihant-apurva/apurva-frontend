import { useEffect, useState } from "react";

const TagInputField = ({ label, name, value, onChange, errors }) => {
  const [tags, setTags] = useState(value || []);
  // console.log(tags);
  
  useEffect(() => {
    setTags(value || []);
  },[value])
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      e.preventDefault();
      setTags([...tags, e.target.value.trim()]);
      onChange({ target: { name, value: [...tags, e.target.value.trim()] } }); // Pass updated value to parent
      e.target.value = "";
    }
  };

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onChange({ target: { name, value: newTags } }); // Update parent form
  };

  return (
    <div>
      <label>{label}</label>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          padding: "5px",
          border: errors?.[name] ? "2px solid red" : "1px solid #ced4da",
          borderRadius: "4px",
          minHeight: "40px"
        }}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              margin: "5px",
              padding: "5px 10px",
              background: "#e6f7ff",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            {tag}{" "}
            <button
              onClick={() => removeTag(index)}
              style={{
                marginLeft: "8px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#ff0000",
                fontWeight: "bold",
              }}
            >
              x
            </button>
          </span>
        ))}
        <input
          type="text"
          name={name}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag and press Enter"
          style={{
            border: "none",
            outline: "none",
            flex: 1,
            minWidth: "100px",
            padding: "5px",
          }}
        />
      </div>
    </div>
  );
};

export default TagInputField;

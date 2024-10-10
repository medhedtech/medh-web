import { Button, Checkbox, Input, Space } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteFilled,
} from "@ant-design/icons";

const handleSearch = (
  selectedKeys,
  confirm,
  dataIndex,
  setFilters,
  filters
) => {
  confirm();
  setFilters({
    ...filters,
    [dataIndex]: selectedKeys[0],
  });
};

const handleReset = (clearFilters, dataIndex, confirm, setFilters, filters) => {
  clearFilters();
  const newFilters = { ...filters };
  delete newFilters[dataIndex];
  setFilters(newFilters);
  confirm();
};

export const getColumnSearchProps = (dataIndex, setFilters, filters) => {
  return {
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          // placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys, confirm, dataIndex, setFilters, filters)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(
                selectedKeys,
                confirm,
                dataIndex,
                setFilters,
                filters
              )
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              handleReset(
                clearFilters,
                dataIndex,
                confirm,
                setFilters,
                filters
              );
              // handleSearch(selectedKeys, confirm, dataIndex);
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
          fontSize: 20,
          //   marginRight: 80,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  };
};

export const getColumnFilterProps = (
  dataIndex,
  options = [],
  setFilters,
  filters
) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div style={{ padding: 8 }}>
      <Checkbox.Group
        style={{
          width: "100%",
          marginBottom: 8,
          display: "flex",
          flexDirection: "column",
        }}
        value={selectedKeys}
        onChange={(checkedValues) => {
          setSelectedKeys(checkedValues);
        }}
      >
        {options.map((category) => (
          <Checkbox key={category.value} value={category.value}>
            {category.text}
          </Checkbox>
        ))}
      </Checkbox.Group>
      <Space>
        <Button
          type="primary"
          onClick={() => {
            confirm();
          }}
          // icon={<FilterOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => {
            // clearFilters();
            // confirm();
            // handleReset(clearFilters, dataIndex, confirm, setFilters, filters);
            let temp = filters;
            delete temp[dataIndex];
            setFilters(temp);
            clearFilters();
            confirm();
          }}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered) => (
    <FilterOutlined
      style={{
        color: filtered ? "#1890ff" : undefined,
        fontSize: 20,
        marginRight: 80,
      }}
    />
  ),
  onFilter: (value, record) => {
    return record[dataIndex].includes(value);
  },
});

"use client";
import { Flex, Space, Table, Tag } from "antd";

const { Column } = Table;

interface DataType {
  key: string;
  name: string;
  role: string;
  address: string;
  status: string;
}

const data: DataType[] = [
  {
    key: "1",
    name: "John",
    role: "User",
    address: "New York No. 1 Lake Park",
    status: "pending",
  },
  {
    key: "2",
    name: "Green",
    role: "Admin",
    address: "London No. 1 Lake Park",
    status: "approved",
  },
  {
    key: "3",
    name: "Black",
    role: "User",
    address: "Sydney No. 1 Lake Park",
    status: "cancelled",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "green";
    case "pending":
      return "geekblue";
    case "cancelled":
      return "volcano";
    default:
      return "default";
  }
};

const Transactions = () => {
  return (
    <div className="bg-[#f5f5f5] p-5 rounded-xl">
      <h2 className="mb-5 font-light text-xl">Latest Transactions</h2>

      <Table<DataType>
        dataSource={data}
        pagination={{
          pageSize: 5,
          placement: ["bottomEnd"],
        }}
        rowKey="key"
      >
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Role" dataIndex="role" key="role" />
        <Column title="Address" dataIndex="address" key="address" />

        <Column
          title="Status"
          dataIndex="status"
          key="status"
          render={(status: string) => (
            <Flex align="center">
              <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
            </Flex>
          )}
        />

        <Column
          title="Action"
          key="action"
          render={(_, record: DataType) => (
            <Space size="middle">
              <a>Invite {record.name}</a>
              <a>Delete</a>
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default Transactions;

import {useEffect, useState } from 'react'

 interface IGridColumn {
    type: "int" | "string",
    label: string,
    field: string
  }

interface IGrid {
    columns: IGridColumn[]
}

function App() {
    return <h1>This is my react/vite site</h1>
}


function App2() {
  const [count, setCount] = useState<number>(0)
  const [data, setData] = useState<any[]>([]);

  const loadData = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/users')
    const dt = await response.json()
    setCount(dt.length)
    setData(dt);
  }

  useEffect(()=>{
    loadData();
  },[])

 
  const grid : IGrid = {
    columns :[
      {
        type:"int",
        label: "Id",
        field:"id"
      },
      {
        type:"string",
        label : "Name",
        field:"name"
      },
      {
        type:"string",
        label : "Email",
        field:"email"
      }
    ]
  }
  
  const renderCell = (type:string, value:any)=>{
    const CellComponent = pluginMap[type];
    return <CellComponent value={value}/>;
  }


const renderTable = (columns: IGridColumn[], records:any[]) => {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50/70">
            <th className="w-10 px-5 py-3.5">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
            </th>
            {columns.map((column) => (
              <th
                key={column.label}
                className="group/head cursor-pointer select-none px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-zinc-500 hover:text-zinc-700"
              >
                <span className="inline-flex items-center gap-1">
                  {column.label}
                  <svg
                    className="h-3 w-3 text-zinc-300 transition-colors group-hover/head:text-zinc-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </th>
            ))}
            <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wide text-zinc-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-100">
          {records?.map((record, idx)=>{
            return (
          <tr className="group transition-colors hover:bg-zinc-50/70" key={idx}>
            <td className="px-5 py-4">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
            </td>
            {columns.map((column) => (
              <td key={column.label} className="px-5 py-4 text-sm text-zinc-700">
                {renderCell(column.type, record[column.field])}
              </td>
            ))}
            <td className="px-5 py-4">
              <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                  aria-label="Edit row"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label="Delete row"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6l-1 14H6L5 6" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>

            )
          })}
        </tbody>
      </table>
    </div>
  );
};

  return (
    <>
      <div className="border-1 border-red-300 bg-red-100 p-4 m-4">
        Count: {count}
        {renderTable(grid.columns, data)}
      </div>
    </>
  )
}

const NumberCell = ({value})=>{
  return (<span>{value}</span>)
}
const StringCell = ({value})=>{
  return (<span>{value}</span>)
}

const pluginMap ={
    "int": NumberCell,
    "string": StringCell
}

export default App

import { Layout } from "@/components/layouts/Layout"
import { List } from "lucide-react"

export default function ApiListPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full">
            <List className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold">API List</h1>
        </div>
      </div>
    </Layout>
  )
}

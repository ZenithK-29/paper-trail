import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group'
import { Mode } from '@/app/dashboard/page'


interface SearchBarProps {
  search: string,
  setSearch: (value: string) => void
  mode: Mode,
  setMode: React.Dispatch<React.SetStateAction<Mode>>
}


function SearchBar({ search, setSearch, mode, setMode }: SearchBarProps) {
  return (
    <div className='bg-gray-200 w-3/4 mx-auto'>
      <div className='flex justify-center w-full items-center gap-3 ml-2 relative'>

        <input type="text"
          placeholder='Search keywords'
          value={search}
          onChange={(e) => { setSearch(e.target.value) }}
          className='bg-white w-340 pl-7 mt-2 rounded-xl h-13 shadow-xl' />


        <ToggleGroup
          type='single'
          value={mode ?? undefined}
          onValueChange={(value) => {
            if (value) setMode(value as Mode)
          }}
        >

          <div className="flex gap-4 mr-2 absolute right-10 top-3.5">
            <ToggleGroupItem value='date' className='text-sm data-[state=on]:bg-orange-400 bg-slate-300 text-white p-5 !rounded-md'>
              By date
            </ToggleGroupItem>

            <ToggleGroupItem value='range' className='text-sm data-[state=on]:bg-orange-400 bg-slate-300 text-white p-5 !rounded-md mr-2 '>
              By date range
            </ToggleGroupItem>

          </div>

        </ToggleGroup>
      </div>
    </div>
  )
}

export default SearchBar
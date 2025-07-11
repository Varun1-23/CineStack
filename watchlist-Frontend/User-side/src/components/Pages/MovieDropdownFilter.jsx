import React from 'react'

function MovieDropdownFilter({genres, languages, selectedGenre, selectedLanguage, onFilterChange}) {

  return (
   
    <div className='d-flex gap-4 mb-4 align-items-end flex-wrap'>
        <div>
            <label className='form-label'>Filter by Genre</label>
            <select 
            className='form-select'
            value={selectedGenre}
            onChange={(e) => onFilterChange('genre', e.target.value)}
            >
                <option value="">All</option>
                {genres.map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                ))}
            </select>
        </div>
        <div>
            <label className='form-label'>Filter by language</label>
            <select 
                className='form-select'
                value={selectedLanguage}
                onChange={(e) => onFilterChange('language', e.target.value)}
            >
                <option value="">All</option>
                {languages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                ))}
            </select>
        </div>
    </div>
  )
}

export default MovieDropdownFilter
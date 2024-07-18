import { useEffect, useState } from 'react';
import './App.css';
import img1 from './resources/5ed9886d61ca3ad6079f94209c1bdbe7.png'

// 0.6% for char, 0.8% for LC
// 5.1% for char, 6.6% for LC
// 4 guaranteed every 10
// guaranteed after failing to obtain a rateup

function App() {
  const [characters, setCharacters] = useState([])
  const [selectedBanner, setSelectedBanner] = useState([])
  const [pastBanners, setPastBanners] = useState([])
  const [tenPullResults, setTenPullResults] = useState([])
  const [singlePullResult, setSinglePullResult] = useState({})
  const [pityStatus, setPityStatus] = useState('5050')
  const [stats, setStats] = useState({
    currentPity: 0,
    totalFiveStars: 0,
    currentPity: 0
  })

  let rarityProbabilities = {
    6: 0.003,
    5: 0.003 / 7,
    4: 0.0255 / 18,
    4.5: 0.0255 / 3,
    3: 0.943
  }

  let rarityProbabilities5050Fail = {
    6: 0.006,
    5: 0,
    4: 0.0255 / 18,
    4.5: 0.0255 / 3,
    3: 0.943
  }

  const initRarityProbabilities = {
    6: 0.003,
    5: 0.003 / 7,
    4: 0.0255 / 18,
    4.5: 0.0255 / 3,
    3: 0.943
  }

  const initRarityProbabilities5050Fail = {
    6: 0.006,
    5: 0,
    4: 0.0255 / 18,
    4.5: 0.0255 / 3,
    3: 0.943
  }

  useEffect(() => {
    fetch('https://star-rail-api.onrender.com/api/banners/getAll')
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        setPastBanners(data)
      })
  })

  useEffect(() => {
    fetch('https://star-rail-api.onrender.com/api/characters/getAll')
      .then(res => {
        return res.json()
      })
      .then(data => {
        setCharacters([...data.Characters, {
          name: 'three star trash',
          rarity: 3,
          icon: img1
        }])
      })
  }, [])

  const tenPull = (pulls) => {
    for (let i = 0; i < 10; i++) {
      const random = Math.random()
      let cumulativeProbability = 0
      for (let j = 0; j < selectedBanner.length; j++) {
        const character = selectedBanner[j]
        cumulativeProbability += rarityProbabilities[character.rarity]
        if (random < cumulativeProbability) {
          pulls.push(character)
          break
        }
      }
    }

  }

  const tenPullGuaranteed = (pulls) => {
    for (let i = 0; i < 10; i++) {
      const random = Math.random()
      let cumulativeProbability = 0
      for (let j = 0; j < selectedBanner.length; j++) {
        const character = selectedBanner[j]
        cumulativeProbability += rarityProbabilities5050Fail[character.rarity]
        if (random < cumulativeProbability) {
          pulls.push(character)
          break
        }
      }
    }
  }

  const tenPullPost70 = (pulls) => {
    const initialResults = []
    const results = pulls
    for (let i = 0; i < 10; i++) {
      if (initialResults.map(character => { return character.rarity }).includes(6) || initialResults.map(character => { return character.rarity }).includes(5)) {
        initialResults.forEach(character => results.push(character))
        break
      } else {
        const random = Math.random()
        let cumulativeProbability = 0
        if (i > 3) {
          rarityProbabilities[6] += 0.025
          rarityProbabilities[5] += 0.025 / 7
          rarityProbabilities[4] -= 0.025 / 19
          rarityProbabilities[4.5] -= 0.025 / 3
          for (let j = 0; j < selectedBanner.length; j++) {
            const character = selectedBanner[j]
            cumulativeProbability += rarityProbabilities[character.rarity]
            if (random < cumulativeProbability) {
              initialResults.push(character)
              break
            }
          }
        } else {
          for (let j = 0; j < selectedBanner.length; j++) {
            const character = selectedBanner[j]
            cumulativeProbability += initRarityProbabilities[character.rarity]
            if (random < cumulativeProbability) {
              initialResults.push(character)
              break
            }
          }
        }
      }
    }

    if (initialResults.length === 10) {
      initialResults.forEach(character => { results.push(character) })
    } else {
      for (let i = 0; i < 10 - initialResults.length; i++) {
        const random = Math.random()
        let cumulativeProbability = 0
        for (let j = 0; j < selectedBanner.length; j++) {
          const character = selectedBanner[j]
          cumulativeProbability += initRarityProbabilities[character.rarity]
          if (random < cumulativeProbability) {
            results.push(character)
            break
          }
        }
      }
    }
  }

  const tenPullPost70Guaranteed = (pulls) => {
    const initialResults = []
    for (let i = 0; i < 10; i++) {
      const random = Math.random()
      let cumulativeProbability = 0
      if (initialResults.map(character => { return character.rarity }).includes(6)) {
        initialResults.forEach(character => pulls.push(character))
        break
      } else {
        if (i > 3) {
          rarityProbabilities5050Fail[6] += 0.05
          rarityProbabilities5050Fail[4] -= 0.025 / 19
          rarityProbabilities[4.5] -= 0.025 / 3
          for (let j = 0; j < selectedBanner.length; j++) {
            const character = selectedBanner[j]
            cumulativeProbability += rarityProbabilities5050Fail[character.rarity]
            if (random < cumulativeProbability) {
              initialResults.push(character)
              break
            }
          }
        } else {
          for (let j = 0; j < selectedBanner.length; j++) {
            const character = selectedBanner[j]
            cumulativeProbability += initRarityProbabilities5050Fail[character.rarity]
            if (random < cumulativeProbability) {
              initialResults.push(character)
              break
            }
          }
        }
      }
    }

    if (initialResults.length === 10) {
      initialResults.forEach(character => pulls.push(character))
    } else {
      for (let i = 0; i < 10 - initialResults.length; i++) {
        const random = Math.random()
        let cumulativeProbability = 0
        for (let j = 0; j < selectedBanner.length; j++) {
          const character = selectedBanner[j]
          cumulativeProbability += initRarityProbabilities5050Fail[character.rarity]
          if (random < cumulativeProbability) {
            pulls.push(character)
            break
          }
        }
      }
    }
  }


  const handle10Pull = () => {
    const results = []
    let currentPity = stats.currentPity
    if (currentPity < 70) {
      if (pityStatus === '5050') {
        tenPull(results)
      } else if (pityStatus === 'Guaranteed') {
        tenPullGuaranteed(results)
      }
    } else if (currentPity >= 70) {
      if (pityStatus === '5050') {
        tenPullPost70(results)
      } else if (pityStatus === 'Guaranteed') {
        tenPullPost70Guaranteed(results)
      }
    }

    setStats({ ...stats, currentPity: stats.currentPity + 10 })

    const resultsRarity = results.map(pull => { return pull.rarity })

    if (!resultsRarity.includes(4) && !resultsRarity.includes(5) && !resultsRarity.includes(6)) {
      const fourStarPity = characters.filter(character => character.rarity == 4)
      results.pop()
      const random = Math.floor(Math.random() * fourStarPity.length)
      results.push(fourStarPity[random])
      setTenPullResults(results)
    } else {
      setTenPullResults(results)
    }

    if (resultsRarity.includes(5) || resultsRarity.includes(6)) {
      setStats({ ...stats, totalFiveStars: stats.totalFiveStars + 1, currentPity: 0 })
    }

    if (resultsRarity.includes(5)) {
      setPityStatus('Guaranteed')
    }

    if (resultsRarity.includes(6)) {
      setPityStatus('5050')
    }
  }

  const handleSinglePull = () => {
    const random = Math.random()
    let cumulativeProbability = 0
    for (let i = 0; i < selectedBanner.length; i++) {
      const character = selectedBanner[i]
      cumulativeProbability += rarityProbabilities[character.rarity]
      if (random < cumulativeProbability) {
        setSinglePullResult(character)
        break
      }
    }
  }




  return (
    <div className="App">


      {selectedBanner.length == 0 && (
        <>
          <h1>Banners</h1>
          <div className='banner-container'>
            {pastBanners.map(banner => {
              const rateupFour = banner.rateupFour.map(character => { return character.name })
              const rateupFive = banner.rateupFive.map(character => { return character.name })
              const rateupDataIndex = characters.findIndex(character => character.name === rateupFive[0])
              return (
                <button className='banner-button' onClick={() => {
                  const filteredCharacters = characters.filter(character => {
                    if (banner.rateupFive[0].name === character.name || character.rarity !== 5 || character.standard == 'true') {
                      return true
                    } else {
                      return false
                    }
                  })
                  setSelectedBanner(filteredCharacters.map((character) => {
                    if (rateupFive.includes(character.name)) {
                      return { ...character, rarity: 6 }
                    } else if (rateupFour.includes(character.name)) {
                      return { ...character, rarity: 4.5 }
                    } else {
                      return character
                    }
                  }))
                }}>
                  {characters[rateupDataIndex] !== undefined && (
                    <img src={characters[rateupDataIndex].icon} style={{ width: '150px' }}></img>
                  )}
                  <p>Ver {banner.version}</p>
                </button>
              )
            })}
          </div>
        </>
      )}

      {selectedBanner.length !== 0 && (
        <>
          <h1>Warp Stats</h1>
          <img src={selectedBanner.filter(character => character.rarity === 6)[0].icon} width={'150px'}></img>
          {selectedBanner.filter(character => character.rarity === 4.5).map(character => {
            return (
              <img src={character.icon} width={'150px'}></img>
            )
          })}
          <p>Current pity: {stats.currentPity}</p>
          <p>Total 5 stars: {stats.totalFiveStars}</p>
          <p>Current pity status: {pityStatus}</p>
          <button onClick={() => { handle10Pull() }}>
            10 Pull
          </button>
          <button onClick={() => { handleSinglePull() }}>
            Single Pull
          </button>
          <button onClick={() => {
            setStats({ ...stats, currentPity: 0, totalFiveStars: 0 })
            setPityStatus('5050')
            setTenPullResults([])
          }}>
            Reset
          </button>
          <button
            onClick={() => {
              setSelectedBanner([])
              setStats({ ...stats, currentPity: 0, totalFiveStars: 0 })
              setPityStatus('5050')
              setTenPullResults([])
              setSinglePullResult({})
            }}
          >
            Return
          </button>
        </>
      )}

      <div>
      </div>
      {selectedBanner.length !== 0 && (
        <div>
          {tenPullResults.map(character => {
            return (
              <img src={character.icon} style={{ width: '150px', paddingLeft: '30px', paddingTop: '30px' }}></img>
            )
          })}
        </div>
      )}

      {selectedBanner.length !== 0 && (
        <div>
          <img src={singlePullResult.icon} style={{ width: '150px', paddingLeft: '30px', paddingTop: '30px' }}></img>
        </div>
      )}
    </div>
  );
}

export default App;
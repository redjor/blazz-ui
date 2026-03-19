"use client"

import { useEffect, useState } from "react"

interface WeatherData {
	temperature: number
	weatherCode: number
	humidity: number
	windSpeed: number
	tempMax: number
	tempMin: number
}

const WMO_DESCRIPTIONS: Record<number, { label: string; icon: string }> = {
	0: { label: "Ciel dégagé", icon: "☀️" },
	1: { label: "Peu nuageux", icon: "🌤" },
	2: { label: "Partiellement nuageux", icon: "⛅" },
	3: { label: "Couvert", icon: "☁️" },
	45: { label: "Brouillard", icon: "🌫" },
	48: { label: "Brouillard givrant", icon: "🌫" },
	51: { label: "Bruine légère", icon: "🌦" },
	53: { label: "Bruine", icon: "🌦" },
	55: { label: "Bruine forte", icon: "🌧" },
	61: { label: "Pluie légère", icon: "🌦" },
	63: { label: "Pluie", icon: "🌧" },
	65: { label: "Pluie forte", icon: "🌧" },
	71: { label: "Neige légère", icon: "🌨" },
	73: { label: "Neige", icon: "❄️" },
	75: { label: "Neige forte", icon: "❄️" },
	77: { label: "Grésil", icon: "🌨" },
	80: { label: "Averses légères", icon: "🌦" },
	81: { label: "Averses", icon: "🌧" },
	82: { label: "Averses fortes", icon: "⛈" },
	85: { label: "Averses de neige", icon: "🌨" },
	86: { label: "Fortes averses de neige", icon: "❄️" },
	95: { label: "Orage", icon: "⛈" },
	96: { label: "Orage avec grêle", icon: "⛈" },
	99: { label: "Orage violent", icon: "⛈" },
}

export function getWeatherInfo(code: number) {
	return WMO_DESCRIPTIONS[code] ?? { label: "Inconnu", icon: "🌡" }
}

// Paris fallback
const DEFAULT_LAT = 48.8566
const DEFAULT_LON = 2.3522

export function useWeather() {
	const [data, setData] = useState<WeatherData | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let cancelled = false

		async function fetchWeather(lat: number, lon: number) {
			try {
				const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
				const res = await fetch(url)
				if (!res.ok) return
				const json = await res.json()
				if (cancelled) return
				setData({
					temperature: Math.round(json.current.temperature_2m),
					weatherCode: json.current.weather_code,
					humidity: json.current.relative_humidity_2m,
					windSpeed: Math.round(json.current.wind_speed_10m),
					tempMax: Math.round(json.daily.temperature_2m_max[0]),
					tempMin: Math.round(json.daily.temperature_2m_min[0]),
				})
			} catch {
				// silently fail — weather is non-critical
			} finally {
				if (!cancelled) setLoading(false)
			}
		}

		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(
				(pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
				() => fetchWeather(DEFAULT_LAT, DEFAULT_LON),
				{ timeout: 3000 }
			)
		} else {
			fetchWeather(DEFAULT_LAT, DEFAULT_LON)
		}

		return () => {
			cancelled = true
		}
	}, [])

	return { data, loading }
}

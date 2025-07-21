import requests
import json
from datetime import datetime, timedelta
import time
import schedule
from typing import Dict, List, Tuple
import os
from dataclasses import dataclass

# Para WhatsApp, vamos usar a biblioteca pywhatkit (instale com: pip install pywhatkit)
# Ou você pode usar a API do WhatsApp Business
import pywhatkit as pwk

@dataclass
class CryptoData:
    name: str
    symbol: str
    price: float
    change_24h: float
    change_7d: float
    market_cap: float
    volume_24h: float
    rank: int


class CryptoMonitor:
    def __init__(self, api_provider='coinlore'):
        """
        Provedor de API options:
        - 'coinlore': Totalmente gratuito, sem API key
        - 'coingecko': Gratuito com limites, API key opcional
        - 'coinpaprika': Gratuito com limites
        - 'coincap': Gratuito com limites
        """
        self.api_provider = api_provider
        self.api_key = os.getenv('COINGECKO_API_KEY', '')  # Opcional para CoinGecko
        self.phone_number = "+5515996009700"  # Substitua pelo seu número
        
        # URLs das APIs gratuitas
        self.api_configs = {
            'coinlore': {
                'base_url': 'https://api.coinlore.net/api',
                'needs_key': False
            },
            'coingecko': {
                'base_url': 'https://api.coingecko.com/api/v3',
                'needs_key': False  # Opcional
            },
            'coinpaprika': {
                'base_url': 'https://api.coinpaprika.com/v1',
                'needs_key': False
            },
            'coincap': {
                'base_url': 'https://api.coincap.io/v2',
                'needs_key': False
            }
        }
        
    def get_crypto_data(self, limit: int = 50) -> List[CryptoData]:
        """Obtém dados das principais criptomoedas usando diferentes APIs gratuitas"""
        if self.api_provider == 'coinlore':
            return self._get_coinlore_data(limit)
        elif self.api_provider == 'coinpaprika':
            return self._get_coinpaprika_data(limit)
        elif self.api_provider == 'coincap':
            return self._get_coincap_data(limit)
        else:  # coingecko (padrão)
            return self._get_coingecko_data(limit)
    
    def _get_coinlore_data(self, limit: int) -> List[CryptoData]:
        """API Coinlore - 100% gratuita, sem rate limit"""
        try:
            url = f"{self.api_configs['coinlore']['base_url']}/tickers/"
            params = {'start': 0, 'limit': limit}
            
            response = requests.get(url, params=params)
            response.raise_for_status()
            
            
            data = response.json()['data']
            crypto_list = []
            
            for coin in data:
                crypto = CryptoData(
                    name=coin['name'],
                    symbol=coin['symbol'].upper(),
                    price=float(coin['price_usd']),
                    change_24h=float(coin.get('percent_change_24h', 0)),
                    change_7d=float(coin.get('percent_change_7d', 0)),
                    market_cap=float(coin.get('market_cap_usd', 0)),
                    volume_24h=float(coin.get('volume24', 0)),
                    rank=int(coin['rank'])
                )
                crypto_list.append(crypto)
                
            return crypto_list
            
        except Exception as e:
            print(f"Erro Coinlore: {e}")
            return self._fallback_api(limit)
    
    def _get_coinpaprika_data(self, limit: int) -> List[CryptoData]:
        """API Coinpaprika - Gratuita com 25k requests/mês"""
        try:
            url = f"{self.api_configs['coinpaprika']['base_url']}/tickers"
            params = {'limit': limit}
            
            response = requests.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            crypto_list = []
            
            for coin in data:
                quotes = coin.get('quotes', {}).get('USD', {})
                crypto = CryptoData(
                    name=coin['name'],
                    symbol=coin['symbol'].upper(),
                    price=float(quotes.get('price', 0)),
                    change_24h=float(quotes.get('percent_change_24h', 0)),
                    change_7d=float(quotes.get('percent_change_7d', 0)),
                    market_cap=float(quotes.get('market_cap', 0)),
                    volume_24h=float(quotes.get('volume_24h', 0)),
                    rank=int(coin['rank'])
                )
                crypto_list.append(crypto)
                
            return crypto_list
            
        except Exception as e:
            print(f"Erro Coinpaprika: {e}")
            return self._fallback_api(limit)
    
    def _get_coincap_data(self, limit: int) -> List[CryptoData]:
        """API CoinCap - Gratuita, 200 requests/min"""
        try:
            url = f"{self.api_configs['coincap']['base_url']}/assets"
            params = {'limit': limit}
            
            response = requests.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()['data']
            crypto_list = []
            
            for coin in data:
                crypto = CryptoData(
                    name=coin['name'],
                    symbol=coin['symbol'].upper(),
                    price=float(coin.get('priceUsd', 0)),
                    change_24h=float(coin.get('changePercent24Hr', 0)),
                    change_7d=0,  # CoinCap não tem dados de 7d na mesma chamada
                    market_cap=float(coin.get('marketCapUsd', 0)),
                    volume_24h=float(coin.get('volumeUsd24Hr', 0)),
                    rank=int(coin['rank'])
                )
                crypto_list.append(crypto)
                
            return crypto_list
            
        except Exception as e:
            print(f"Erro CoinCap: {e}")
            return self._fallback_api(limit)
    
    def _get_coingecko_data(self, limit: int) -> List[CryptoData]:
        """API CoinGecko - Gratuita com limites, API key opcional"""
        try:
            url = f"{self.api_configs['coingecko']['base_url']}/coins/markets"
            params = {
                'vs_currency': 'usd',
                'order': 'market_cap_desc',
                'per_page': limit,
                'page': 1,
                'sparkline': False,
                'price_change_percentage': '24h,7d'
            }
            
            if self.api_key:
                params['x_cg_demo_api_key'] = self.api_key
                
            response = requests.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            crypto_list = []
            
            for coin in data:
                crypto = CryptoData(
                    name=coin['name'],
                    symbol=coin['symbol'].upper(),
                    price=coin['current_price'],
                    change_24h=coin.get('price_change_percentage_24h', 0),
                    change_7d=coin.get('price_change_percentage_7d', 0),
                    market_cap=coin['market_cap'],
                    volume_24h=coin['total_volume'],
                    rank=coin['market_cap_rank']
                )
                crypto_list.append(crypto)
                
            return crypto_list
            
        except Exception as e:
            print(f"Erro CoinGecko: {e}")
            return self._fallback_api(limit)
    
    def _fallback_api(self, limit: int) -> List[CryptoData]:
        """Tenta APIs alternativas em caso de falha"""
        apis_to_try = ['coinlore', 'coinpaprika', 'coincap', 'coingecko']
        
        for api in apis_to_try:
            if api != self.api_provider:
                try:
                    print(f"Tentando API alternativa: {api}")
                    temp_provider = self.api_provider
                    self.api_provider = api
                    result = self.get_crypto_data(limit)
                    self.api_provider = temp_provider
                    
                    if result:
                        return result
                        
                except Exception as e:
                    print(f"Falha na API {api}: {e}")
                    continue
        
        return []
    
    def analyze_market(self, crypto_list: List[CryptoData]) -> Dict:
        """Analisa o mercado e identifica tendências"""
        if not crypto_list:
            return {}
            
        # Moedas em alta (>5% em 24h)
        em_alta = [c for c in crypto_list if c.change_24h > 5]
        em_alta.sort(key=lambda x: x.change_24h, reverse=True)
        
        # Moedas em baixa (<-5% em 24h)
        em_baixa = [c for c in crypto_list if c.change_24h < -5]
        em_baixa.sort(key=lambda x: x.change_24h)
        
        # Oportunidades (crescimento 7d positivo e 24h negativo)
        oportunidades = [c for c in crypto_list if c.change_7d > 0 and c.change_24h < -2]
        oportunidades.sort(key=lambda x: x.change_7d, reverse=True)
        
        # Top gainers e losers
        top_gainers = sorted(crypto_list, key=lambda x: x.change_24h, reverse=True)[:5]
        top_losers = sorted(crypto_list, key=lambda x: x.change_24h)[:5]
        
        return {
            'em_alta': em_alta[:10],
            'em_baixa': em_baixa[:10],
            'oportunidades': oportunidades[:5],
            'top_gainers': top_gainers,
            'top_losers': top_losers,
            'timestamp': datetime.now()
        }
    
    def format_message(self, analysis: Dict) -> str:
        """Formata a mensagem para WhatsApp"""
        if not analysis:
            return "❌ Erro ao obter dados do mercado cripto"
            
        timestamp = analysis['timestamp'].strftime("%d/%m/%Y às %H:%M")
        
        message = f"""🚀 *RELATÓRIO CRIPTO* 📊
📅 {timestamp}

━━━━━━━━━━━━━━━━━━━━

📈 *MOEDAS EM ALTA* (24h)
"""
        
        for crypto in analysis['em_alta'][:5]:
            emoji = "🔥" if crypto.change_24h > 10 else "📈"
            message += f"{emoji} *{crypto.symbol}* ({crypto.name})\n"
            message += f"   💰 ${crypto.price:.4f}\n"
            message += f"   📊 +{crypto.change_24h:.2f}%\n\n"
        
        message += "\n📉 *MOEDAS EM BAIXA* (24h)\n"
        
        for crypto in analysis['em_baixa'][:5]:
            emoji = "💥" if crypto.change_24h < -10 else "📉"
            message += f"{emoji} *{crypto.symbol}* ({crypto.name})\n"
            message += f"   💰 ${crypto.price:.4f}\n"
            message += f"   📊 {crypto.change_24h:.2f}%\n\n"
        
        if analysis['oportunidades']:
            message += "\n💎 *OPORTUNIDADES DE COMPRA*\n"
            message += "_(Crescimento 7d positivo, queda 24h)_\n\n"
            
            for crypto in analysis['oportunidades']:
                message += f"💎 *{crypto.symbol}* ({crypto.name})\n"
                message += f"   💰 ${crypto.price:.4f}\n"
                message += f"   📊 24h: {crypto.change_24h:.2f}%\n"
                message += f"   📈 7d: +{crypto.change_7d:.2f}%\n\n"
        
        message += "\n🏆 *TOP PERFORMERS* (24h)\n"
        
        for i, crypto in enumerate(analysis['top_gainers'][:3], 1):
            medals = ["🥇", "🥈", "🥉"]
            message += f"{medals[i-1]} *{crypto.symbol}*: +{crypto.change_24h:.2f}%\n"
        
        message += "\n📊 *RESUMO DO MERCADO*\n"
        total_coins = len(analysis['em_alta']) + len(analysis['em_baixa'])
        message += f"🔥 Em alta: {len(analysis['em_alta'])} moedas\n"
        message += f"❄️ Em baixa: {len(analysis['em_baixa'])} moedas\n"
        message += f"💎 Oportunidades: {len(analysis['oportunidades'])} moedas\n"
        
        message += "\n━━━━━━━━━━━━━━━━━━━━\n"
        message += "⚠️ *Não é aconselhamento financeiro*\n"
        message += "📚 Sempre faça sua própria pesquisa"
        
        return message
    
    def send_whatsapp_message(self, message: str):
        """Envia mensagem via WhatsApp usando pywhatkit"""
        try:
            # Método 1: Usando pywhatkit (abre WhatsApp Web)
            now = datetime.now()
            send_time = now + timedelta(minutes=1)
            
            pwk.sendwhatmsg(
                self.phone_number,
                message,
                send_time.hour,
                send_time.minute,
                wait_time=15,
                tab_close=True
            )
            
            print(f"✅ Mensagem agendada para {send_time.strftime('%H:%M')}")
            
        except Exception as e:
            print(f"❌ Erro ao enviar mensagem: {e}")
            # Fallback: salvar em arquivo
            self.save_to_file(message)
    
    def send_whatsapp_business_api(self, message: str):
        """Alternativa usando WhatsApp Business API"""
        # Você precisa configurar a API do WhatsApp Business
        # Este é um exemplo genérico
        
        api_url = "https://graph.facebook.com/v17.0/YOUR_PHONE_ID/messages"
        headers = {
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
            'Content-Type': 'application/json'
        }
        
        payload = {
            "messaging_product": "whatsapp",
            "to": self.phone_number.replace('+', ''),
            "type": "text",
            "text": {"body": message}
        }
        
        try:
            response = requests.post(api_url, headers=headers, json=payload)
            response.raise_for_status()
            print("✅ Mensagem enviada via WhatsApp Business API")
        except Exception as e:
            print(f"❌ Erro na API: {e}")
    
    def save_to_file(self, message: str):
        """Salva relatório em arquivo como backup"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"crypto_report_{timestamp}.txt"
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(message)
        
        print(f"📄 Relatório salvo em: {filename}")
    
    def run_analysis(self):
        """Executa análise completa e envia relatório"""
        print("🔄 Iniciando análise do mercado cripto...")
        
        # Obtém dados das criptomoedas
        crypto_data = self.get_crypto_data(100)
        
        if not crypto_data:
            print("❌ Falha ao obter dados")
            return
        
        # Analisa o mercado
        analysis = self.analyze_market(crypto_data)
        
        # Formata mensagem
        message = self.format_message(analysis)
        
        # Envia via WhatsApp
        self.send_whatsapp_message(message)
        
        print("✅ Análise concluída!")

def main():
    # Inicializa o monitor com API gratuita
    # Opções: 'coinlore', 'coinpaprika', 'coincap', 'coingecko'
    monitor = CryptoMonitor(api_provider='coinlore')  # 100% gratuita!
    
    print(f"🤖 Bot iniciado com API: {monitor.api_provider}")
    
    # Configura agendamentos
    # Relatório a cada 4 horas
    schedule.every(2).hours.do(monitor.run_analysis)
    
    # Relatório matinal (8h)
    schedule.every().day.at("08:00").do(monitor.run_analysis)
    
    # Relatório noturno (20h)
    schedule.every().day.at("20:00").do(monitor.run_analysis)
    
    print("📊 Relatórios programados para: 8h, 20h e a cada 4h")
    print("🛑 Pressione Ctrl+C para parar")
    
    # Executa uma análise inicial
    monitor.run_analysis()
    
    # Loop principal
    while True:
        schedule.run_pending()
        time.sleep(200)  # Verifica a cada minuto

if __name__ == "__main__":
    main()
import requests
from datetime import datetime
from typing import Dict, List
from dataclasses import dataclass
import os

# pasta_info = r"/home/FelipeHondei/crypto_monitor.py/Relatorios"
pasta_info = r"C:\Users\felipe.hondei\OneDrive - LAPONIA SUDESTE LTDA\Área de Trabalho\Pessoal\Cripto\Relatorios"

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
        
        # URLs das APIs gratuitas
        self.api_configs = {
            'coinlore': {
                'base_url': 'https://api.coinlore.net/api',
                'needs_key': False
            }
        }
        
    def get_crypto_data(self, limit: int = 50) -> List[CryptoData]:
        """Obtém dados das principais criptomoedas usando diferentes APIs gratuitas"""
        if self.api_provider == 'coinlore':
            return self._get_coinlore_data(limit)
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
    
    def save_to_file(self, message: str):
        """Salva relatório em arquivo como backup"""
        timestamp = datetime.now().strftime("%d-%m-%y")
        filename = f"crypto_report_{timestamp}.txt"
        caminho_final = os.path.join(pasta_info, filename)
        
        with open(caminho_final, 'w', encoding='utf-8') as f:
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

        self.save_to_file(message)
        
        print("✅ Análise concluída!")

def main():
    # Inicializa o monitor com API gratuita
    # Opções: 'coinlore', 'coinpaprika', 'coincap', 'coingecko'
    monitor = CryptoMonitor(api_provider='coinlore')  # 100% gratuita!
    
    print(f"🤖 Bot iniciado com API: {monitor.api_provider}")
    print("🛑 Pressione Ctrl+C para parar")
    
    # Executa uma análise inicial
    monitor.run_analysis()

if __name__ == "__main__":
    main()
@echo off
setlocal enabledelayedexpansion

echo Iniciando execucao dos scripts...
echo %date% %time% - Inicio da execucao >> log_execucao.txt

cd /home/FelipeHondei/crypto_monitor.py

echo Limpando pasta downloads_csv...
if exist "Relatorios" (
    del /q "Relatorios\*.*" 2>nul
    echo Pasta downloads_csv limpa com sucesso >> log_execucao.txt
) else (
    echo Pasta downloads_csv nao encontrada - criando... >> log_execucao.txt
    mkdir "Relatorios"
)

echo Executando Script Crypto...
python crypto_monitor.py
if %errorlevel% neq 0 (
    echo ERRO no Script Crypto 1 >> log_execucao.txt
) else (
    echo Script Crypto 1 executado com sucesso >> log_execucao.txt
    timeout /t 3 /nobreak >nul
)


echo %date% %time% - Fim da execucao >> log_execucao.txt
echo Execucao finalizada.
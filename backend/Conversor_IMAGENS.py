import sys
import os
import json
from PIL import Image

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

def converter_imagens(pasta_origem, pasta_destino, formato_saida):
    try:
        if not os.path.exists(pasta_origem):
            return {"sucesso": False, "mensagem": f"A pasta de origem '{pasta_origem}' não existe."}

        formato_saida = formato_saida.lower().strip()
        formatos_validos = ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'pdf', 'gif']
        if formato_saida not in formatos_validos:
            return {"sucesso": False, "mensagem": f"Formato inválido: {formato_saida}"}

        extensoes_suportadas = ('.png', '.jpg', '.jpeg', '.webp', '.bmp', '.pdf', '.gif')

        # 1. Carrega as imagens de origem antes de alterar qualquer coisa
        arquivos_origem = [
            f for f in os.listdir(pasta_origem) 
            if f.lower().endswith(extensoes_suportadas) and os.path.isfile(os.path.join(pasta_origem, f))
        ]

        if not arquivos_origem:
            return {"sucesso": False, "mensagem": "Nenhuma imagem suportada encontrada na pasta de origem."}

        caminhos_leitura = [os.path.join(pasta_origem, f) for f in arquivos_origem]

        # 2. Definição da Pasta de Destino
        destino_manual = pasta_destino is not None and pasta_destino != 'null' and pasta_destino.strip() != ''

        if not destino_manual:
            nome_pasta_origem = os.path.basename(os.path.normpath(pasta_origem))
            pasta_pai = os.path.dirname(os.path.normpath(pasta_origem))
            
            if " Convertidas em " in nome_pasta_origem:
                nome_pasta_origem = nome_pasta_origem.split(" Convertidas em ")[0]

            nome_pasta_saida = f"{nome_pasta_origem} Convertidas em {formato_saida.upper()}"
            pasta_destino = os.path.join(pasta_pai, nome_pasta_saida)

            # Reutiliza a pasta convertida antiga se já existir uma no mesmo diretório
            if not os.path.exists(pasta_destino):
                for item in os.listdir(pasta_pai):
                    caminho_item = os.path.join(pasta_pai, item)
                    if os.path.isdir(caminho_item) and " Convertidas em " in item and item.startswith(nome_pasta_origem):
                        pasta_destino = caminho_item
                        break

        if not os.path.exists(pasta_destino):
            os.makedirs(pasta_destino)

        convertidos = 0
        erros = 0

        # 3. Processa a conversão salvando no destino
        for caminho_entrada in caminhos_leitura:
            nome_arquivo = os.path.basename(caminho_entrada)
            nome_base, ext_antiga = os.path.splitext(nome_arquivo)
            
            nome_saida = f"{nome_base}.{formato_saida}"
            caminho_saida = os.path.join(pasta_destino, nome_saida)

            try:
                with Image.open(caminho_entrada) as img:
                    if formato_saida in ['jpg', 'jpeg'] and img.mode in ('RGBA', 'LA', 'P'):
                        img = img.convert('RGB')
                    
                    salvar_formato = 'JPEG' if formato_saida in ['jpg', 'jpeg'] else formato_saida.upper()
                    img.save(caminho_saida, format=salvar_formato)
                    convertidos += 1

            except Exception:
                erros += 1

        # 4. LIMPEZA DOS ARQUIVOS ANTIGOS NA PASTA DE DESTINO
        # Deleta arquivos da pasta de destino que possuem extensão diferente do formato atual
        if convertidos > 0 and os.path.exists(pasta_destino):
            for item in os.listdir(pasta_destino):
                caminho_item = os.path.join(pasta_destino, item)
                if os.path.isfile(caminho_item) and item.lower().endswith(extensoes_suportadas):
                    # Se não for da nova extensão e a origem for diferente (para não apagar originais), apaga do destino
                    if not item.lower().endswith(f".{formato_saida}"):
                        if os.path.abspath(caminho_item) not in [os.path.abspath(c) for c in caminhos_leitura]:
                            try:
                                os.remove(caminho_item)
                            except Exception:
                                pass

        # 5. RENOMEAÇÃO DA PASTA PARA O NOVO FORMATO
        if convertidos > 0:
            nome_pasta_atual = os.path.basename(os.path.normpath(pasta_destino))
            if " Convertidas em " in nome_pasta_atual:
                base_nome = nome_pasta_atual.split(" Convertidas em ")[0]
                novo_nome_pasta = f"{base_nome} Convertidas em {formato_saida.upper()}"
                nova_pasta_destino = os.path.join(os.path.dirname(os.path.normpath(pasta_destino)), novo_nome_pasta)

                if pasta_destino != nova_pasta_destino:
                    try:
                        if os.path.exists(nova_pasta_destino):
                            for item in os.listdir(pasta_destino):
                                os.replace(os.path.join(pasta_destino, item), os.path.join(nova_pasta_destino, item))
                            os.rmdir(pasta_destino)
                        else:
                            os.rename(pasta_destino, nova_pasta_destino)
                        pasta_destino = nova_pasta_destino
                    except Exception:
                        pass

        return {
            "sucesso": True,
            "mensagem": f"Conversão concluída! {convertidos} imagens salvas em '{os.path.basename(pasta_destino)}'.",
            "convertidos": convertidos,
            "erros": erros,
            "pastaDestino": pasta_destino
        }

    except Exception as e:
        return {"sucesso": False, "mensagem": f"Erro interno no Python: {str(e)}"}

if __name__ == "__main__":
    if len(sys.argv) >= 4:
        origem = sys.argv[1]
        destino = sys.argv[2]
        formato = sys.argv[3]
        resultado = converter_imagens(origem, destino, formato)
        print(json.dumps(resultado, ensure_ascii=False))
    else:
        print(json.dumps({"sucesso": False, "mensagem": "Argumentos insuficientes fornecidos ao script."}))
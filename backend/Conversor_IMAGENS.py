
'''
print("------------- Conversor para JPG ------------------")

from pathlib import Path
from PIL import Image
import os

home = Path.home()

pasta_origem = home / "Downloads" / "FOTOSCADASTRO"
pasta_destino = home / "Downloads" / "FOTOS-USUARIOSJPG"

os.makedirs(pasta_destino, exist_ok=True)

if not pasta_origem.exists():
    print(f"A pasta de origem não existe: {pasta_origem}")
else:

    for arquivo in os.listdir(pasta_origem):
        if arquivo.lower().endswith((".jflf", ".jfif", ".jpeg")):
            caminho_origem = pasta_origem / arquivo
            nome_sem_ext = arquivo.rsplit(".", 1)[0]
            caminho_destino = pasta_destino / f"{nome_sem_ext}.jpg"

            try:
                img = Image.open(caminho_origem)
                img.convert("RGB").save(caminho_destino, "JPEG")
                print(f"Convertida: {arquivo} -> {caminho_destino}")
            except Exception as e:
                print(f"Erro ao converter {arquivo}: {e}")

print("----------------------Conversão concluída!-------------------------------")

'''



print("---------------------- Conversor de Imagens ----------------------")

from pathlib import Path
from PIL import Image
import os
import shutil


home = Path.home()
while True:
    caminho_origem_input = input("Digite o caminho da pasta de origem (ou apenas o nome se estiver em Downloads): ").strip()

    if not os.path.isabs(caminho_origem_input):
        pasta_origem = home / "Downloads" / caminho_origem_input
    else:
        pasta_origem = Path(caminho_origem_input)

    if not pasta_origem.exists():
        print(f"\033[91mA pasta de origem: '{caminho_origem_input}' não existe! Tente novamente.\033[0m")
    else:
        break


formatos_validos = {
    "jpg": "JPEG",
    "jpeg": "JPEG",
    "png": "PNG",
    "jfif": "JFIF",
    "bmp": "BMP",
    "tiff": "TIFF",
    "webp": "WEBP",
    "gif": "GIF",
    "pdf": "PDF",
}


while True:
    formato_saida = input("Digite o formato de saída desejado (ex: jpg, png, jfif...): ").lower()
    if formato_saida in formatos_validos:
        formato_pillow = formatos_validos[formato_saida]
        break
    else:
        print(f"\033[91mFormato '{formato_saida}' não suportado! Tente novamente.\033[0m")


pasta_criada = False
pasta_destino = None
imagens_convertidas = 0

for arquivo in os.listdir(pasta_origem):
    caminho_origem = pasta_origem / arquivo

    try:
        img = Image.open(caminho_origem)
    except:
        print(f"\033[91mIgnorado (não é imagem):\033[0m {arquivo}")
        continue

    try:
        if formato_saida.lower() == "jpg":
            img = img.convert("RGB")

        pasta_destino = home / "Downloads" / f"{caminho_origem_input}_convertida_em_{formato_saida}"
        nome_sem_ext = arquivo.rsplit(".", 1)[0]
        caminho_destino = pasta_destino / f"{nome_sem_ext}.{formato_saida}"

        if not pasta_criada:
            os.makedirs(pasta_destino, exist_ok=True)
            pasta_criada = True


        img.save(caminho_destino, formato_pillow)
        imagens_convertidas += 1

        print(f"\033[94mConvertida:\033[0m {arquivo} -> {formato_saida}")

    except Exception as e:

        print(f"\033[91mErro ao converter\033[0m {arquivo}: {e}")

if imagens_convertidas > 0:
    print(f"---------------------- \033[92mConversão concluída!\033[0m \033[93m{imagens_convertidas}\033[0m imagens convertidas em {formato_saida}. ----------------------")
else:
    print("\033[93m ---------------------- Nenhuma imagem foi convertida! ----------------------\033[0m")
    #shutil.rmtree(pasta_destino) #faz a exclusao da pasta_destino, caso nenhuma imagem for convertida, por algum motivo antes a pasta era criada mesmo sem nenhuma imagem convertida. Aí tive que colocar o shutil para excluir, mas a solução foi colocar a lista de formatos validos, que deixa ele obsoleto, mas ele ta ai caso precise

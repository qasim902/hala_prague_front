remote="agadmin@20.198.100.116"
path="/var/efs/statichosting/source/halaprague-admin.appgain.io/"
npm run build
cd build
zip -r dist.zip ./*
scp dist.zip $remote:/tmp/dist.zip
ssh -t $remote  << EOF
cd $path
echo '1024appgain' | sudo -S rm -r ./*
sudo cp /tmp/dist.zip ./
sudo unzip dist.zip
EOF
echo "deployed successfully, thanks for your patience"cd d

if [ ! -d "result/eclipse" ]
then 
    cp -r /usr/eclipse /result/eclipse
fi
clear && echo "Palladio Architecture Simulation started."
start=$(date +%s)
# sleep $(($%10))
/usr/RunExperimentAutomation.sh $1 $2
end=$(date +%s)
elapsed=$(($end - $start))
echo "Palladio Architecture Simulation ended. Elapsed time: $(( ${elapsed} / 3600 ))h $(( (${elapsed} / 60) % 60 ))m $(( ${elapsed} % 60 ))s"
cd projects && mkdir -p output/$3
cp $2 output/$3/$4.gen.experiments
cd ~/result && mv `ls -1 ./ | ls -1 | grep -v 'eclipse\|workspace'` /projects/output/$3
